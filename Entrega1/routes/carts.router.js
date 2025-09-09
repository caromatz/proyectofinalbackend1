import { Router } from "express";
import { Cart } from "../models/cart.js";
import { Product } from "../models/Product.js";

const router = Router();

// Crear carrito nuevo
router.post("/", async (req, res, next) => {
  try {
    const newCart = await Cart.create({ products: [] });
    res.status(201).json(newCart);
  } catch (err) {
    next(err);
  }
});

// Obtener carrito con populate
router.get("/:cid", async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate("products.product");
    cart ? res.json(cart) : res.status(404).json({ error: "Carrito no encontrado" });
  } catch (err) {
    next(err);
  }
});

// Agregar producto al carrito
router.post("/:cid/product/:pid", async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const product = await Product.findById(req.params.pid);
    if (!product) return res.status(404).json({ error: "Producto no encontrado" });

    const item = cart.products.find(p => p.product.toString() === req.params.pid);
    if (item) {
      item.quantity += 1;
    } else {
      cart.products.push({ product: req.params.pid, quantity: 1 });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    next(err);
  }
});

/* 🔽🔽🔽 ENDPOINTS FALTANTES 🔽🔽🔽 */

// DELETE api/carts/:cid/products/:pid → eliminar producto específico
router.delete("/:cid/products/:pid", async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = cart.products.filter(p => p.product.toString() !== req.params.pid);

    await cart.save();
    res.json({ message: "Producto eliminado del carrito", cart });
  } catch (err) {
    next(err);
  }
});

// PUT api/carts/:cid → reemplazar todos los productos
router.put("/:cid", async (req, res, next) => {
  try {
    const { products } = req.body;
    if (!Array.isArray(products)) {
      return res.status(400).json({ error: "Debes enviar un arreglo de productos" });
    }

    const cart = await Cart.findByIdAndUpdate(
      req.params.cid,
      { products },
      { new: true }
    ).populate("products.product");

    cart ? res.json(cart) : res.status(404).json({ error: "Carrito no encontrado" });
  } catch (err) {
    next(err);
  }
});

// PUT api/carts/:cid/products/:pid → actualizar cantidad de un producto
router.put("/:cid/products/:pid", async (req, res, next) => {
  try {
    const { quantity } = req.body;
    if (typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({ error: "La cantidad debe ser un número mayor a 0" });
    }

    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    const item = cart.products.find(p => p.product.toString() === req.params.pid);
    if (!item) return res.status(404).json({ error: "Producto no está en el carrito" });

    item.quantity = quantity;
    await cart.save();

    res.json(cart);
  } catch (err) {
    next(err);
  }
});

// DELETE api/carts/:cid → vaciar carrito
router.delete("/:cid", async (req, res, next) => {
  try {
    const cart = await Cart.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });

    cart.products = [];
    await cart.save();

    res.json({ message: "Carrito vaciado correctamente", cart });
  } catch (err) {
    next(err);
  }
});

export default router;

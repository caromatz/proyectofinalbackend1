import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();

// Agregar producto al carrito
router.post("/:cid/products/:pid", async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await cartManager.addProduct(cid, pid, quantity || 1);
    res.json({ status: "success", cart });
  } catch (err) {
    next(err);
  }
});

// Eliminar producto del carrito
router.delete("/:cid/products/:pid", async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartManager.deleteProduct(cid, pid);
    res.json({ status: "success", cart });
  } catch (err) {
    next(err);
  }
});

// Actualizar cantidad de un producto
router.put("/:cid/products/:pid", async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await cartManager.updateProductQuantity(cid, pid, quantity);
    res.json({ status: "success", cart });
  } catch (err) {
    next(err);
  }
});

// Reemplazar todos los productos del carrito
router.put("/:cid", async (req, res, next) => {
  try {
    const { cid } = req.params;
    const { products } = req.body; // [{ productId, quantity }]
    const cart = await cartManager.updateCartProducts(cid, products);
    res.json({ status: "success", cart });
  } catch (err) {
    next(err);
  }
});

// Vaciar carrito
router.delete("/:cid", async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.clearCart(cid);
    res.json({ status: "success", cart });
  } catch (err) {
    next(err);
  }
});

export default router;

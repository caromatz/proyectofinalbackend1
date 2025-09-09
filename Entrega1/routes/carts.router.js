import { Router } from 'express';
import CartModel from '../models/Carts.js';

const router = Router();

// DELETE /api/carts/:cid/products/:pid → eliminar producto
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();

    res.json({ status: 'success', cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PUT /api/carts/:cid → actualizar todos los productos
router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body; // [{product: 'id', quantity: n}, ...]
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = products;
    await cart.save();

    res.json({ status: 'success', cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// PUT /api/carts/:cid/products/:pid → actualizar cantidad de producto
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    const productInCart = cart.products.find(p => p.product.toString() === pid);
    if (productInCart) {
      productInCart.quantity = quantity;
    } else {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado en carrito' });
    }

    await cart.save();
    res.json({ status: 'success', cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// DELETE /api/carts/:cid → eliminar todos los productos
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    cart.products = [];
    await cart.save();

    res.json({ status: 'success', cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// GET /api/carts/:cid → traer carrito con productos completos (populate)
router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartModel.findById(cid).populate('products.product');
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    res.json({ status: 'success', cart });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default router;

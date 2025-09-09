// routes/views.router.js
import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import CartManager from '../managers/CartManager.js';

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

// Mostrar productos con paginación
router.get('/products', async (req, res, next) => {
  try {
    const { page, limit, sort, category, status } = req.query;
    const result = await productManager.getProducts({
      page, limit, sort, query: { category, status }
    });

    res.render('products', { 
      title: 'Productos', 
      products: result.payload,
      pagination: {
        page: result.page,
        totalPages: result.totalPages,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.prevLink,
        nextLink: result.nextLink
      }
    });
  } catch (err) {
    next(err);
  }
});

// Producto individual
router.get('/products/:pid', async (req, res, next) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) return res.status(404).send('Producto no encontrado');
    res.render('product', { title: product.title, product });
  } catch (err) {
    next(err);
  }
});

// Ver carrito
router.get('/carts/:cid', async (req, res, next) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');
    res.render('cart', { title: 'Carrito', cart });
  } catch (err) {
    next(err);
  }
});

export default router;

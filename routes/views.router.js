import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import CartManager from '../managers/CartManager.js';

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();


router.get('/products', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, sort, query } = req.query;

    const result = await productManager.getProducts({
      page: Number(page),
      limit: Number(limit),
      sort,
      query: query ? JSON.parse(query) : {}
    });

    res.render('products', { 
      title: 'Productos', 
      products: result.payload,
      page: result.page,
      totalPages: result.totalPages,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `/products?page=${result.prevPage}&limit=${limit}` : null,
      nextLink: result.hasNextPage ? `/products?page=${result.nextPage}&limit=${limit}` : null,
      cartId: req.session.cartId // <--- clave para el navbar
    });
  } catch (err) {
    next(err);
  }
});


router.get('/products/:pid', async (req, res, next) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) return res.status(404).send('Producto no encontrado');

    res.render('product', { 
      title: product.title, 
      product, 
      cartId: req.session.cartId // <--- clave para el navbar
    });
  } catch (err) {
    next(err);
  }
});


router.get('/carts/:cid', async (req, res, next) => {
  try {
    const cart = await cartManager.getCartById(req.params.cid);
    if (!cart) return res.status(404).send('Carrito no encontrado');

    res.render('cart', { 
      title: 'Carrito', 
      cart, 
      cartId: req.session.cartId 
    });
  } catch (err) {
    next(err);
  }
});

export default router;

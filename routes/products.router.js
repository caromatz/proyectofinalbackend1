// routes/products.router.js
import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager();

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const { limit, page, sort, category, status, minPrice, maxPrice } = req.query;

    // Construir objeto query para el manager
    const query = {};
    if (category) query.category = category;
    if (status !== undefined) query.status = status === 'true';
    if (minPrice) query.minPrice = Number(minPrice);
    if (maxPrice) query.maxPrice = Number(maxPrice);

    const result = await productManager.getProducts({
      limit,
      page,
      sort,
      query,
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
  }
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.pid);
    if (!product) {
      return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    }
    res.json({ status: 'success', payload: product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error al obtener producto' });
  }
});

export default router;

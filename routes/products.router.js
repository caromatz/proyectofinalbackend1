import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';
import mongoose from 'mongoose';

const router = Router();
const productManager = new ProductManager();


router.get('/', async (req, res) => {
  try {
    const { limit, page, sort, category, status, minPrice, maxPrice } = req.query;

    const query = {};
    if (category) query.category = category;
    if (status !== undefined) query.status = status === 'true';
    if (minPrice) query.minPrice = Number(minPrice);
    if (maxPrice) query.maxPrice = Number(maxPrice);

    const result = await productManager.getProducts({
      limit: Number(limit) || 10,
      page: Number(page) || 1,
      sort,
      query,
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 'error', message: 'Error al obtener productos' });
  }
});


router.get('/:pid', async (req, res) => {
  try {
    const { pid } = req.params;

    
    if (!mongoose.Types.ObjectId.isValid(pid)) {
      return res.status(400).json({ status: 'error', message: 'ID de producto inválido' });
    }

    const product = await productManager.getProductById(pid);
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

import { Router } from 'express';
import ProductModel from '../models/Product.js';
import mongoosePaginate from 'mongoose-paginate-v2';

const router = Router();

// GET /products
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort = req.query.sort === 'asc' ? { price: 1 } : req.query.sort === 'desc' ? { price: -1 } : {};
    const query = req.query.query ? { category: req.query.query } : {};

    const options = {
      page,
      limit,
      sort,
      lean: true,
    };

    const result = await ProductModel.paginate(query, options);

    // Construir prevLink y nextLink
    const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}`;
    const prevLink = result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}&limit=${limit}&sort=${req.query.sort || ''}&query=${req.query.query || ''}` : null;
    const nextLink = result.hasNextPage ? `${baseUrl}?page=${result.nextPage}&limit=${limit}&sort=${req.query.sort || ''}&query=${req.query.query || ''}` : null;

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink,
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;

// managers/ProductManager.js
import { Product } from '../models/Product.js';

export default class ProductManager {
  async getProducts({ limit = 10, page = 1, query, sort }) {
    const filter = {};
    if (query) {
      if (query.category) filter.category = query.category;
      if (query.status !== undefined) filter.status = query.status;
    }

    const options = {
      limit: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
      sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {},
    };

    const products = await Product.find(filter, null, options);
    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return {
      status: 'success',
      payload: products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page: Number(page),
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page-1}` : null,
      nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page+1}` : null,
    };
  }

  async getProductById(id) {
    return await Product.findById(id);
  }

  async addProduct(product) {
    return await Product.create(product);
  }

  async updateProduct(id, update) {
    return await Product.findByIdAndUpdate(id, update, { new: true });
  }

  async deleteProduct(id) {
    return await Product.findByIdAndDelete(id);
  }
}

// managers/ProductManager.js
import Product from '../models/Product.js';

export default class ProductManager {
  async getProducts({ limit = 10, page = 1, query = {}, sort }) {
    const filter = {};

    if (query.category) filter.category = query.category;
    if (query.status !== undefined) filter.status = query.status === 'true';

    if (query.minPrice) filter.price = { ...filter.price, $gte: Number(query.minPrice) };
    if (query.maxPrice) filter.price = { ...filter.price, $lte: Number(query.maxPrice) };

    const options = {
      page: Number(page),
      limit: Number(limit),
      sort: {},
      lean: true
    };

    if (sort) {
      options.sort.price = sort === 'asc' ? 1 : -1;
    }

    const result = await Product.paginate(filter, options);

    const buildLink = (p) => `/api/products?limit=${limit}&page=${p}${sort ? `&sort=${sort}` : ''}${query.category ? `&category=${query.category}` : ''}${query.status ? `&status=${query.status}` : ''}`;

    return {
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.hasPrevPage ? result.prevPage : null,
      nextPage: result.hasNextPage ? result.nextPage : null,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? buildLink(result.prevPage) : null,
      nextLink: result.hasNextPage ? buildLink(result.nextPage) : null,
    };
  }

  async getProductById(id) {
    return await Product.findById(id).lean();
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

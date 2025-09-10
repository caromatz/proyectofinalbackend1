// managers/ProductManager.js
import Product from '../models/Product.js'; // default export

export default class ProductManager {
  async getProducts({ limit = 10, page = 1, query = {}, sort }) {
    const filter = {};

    // Filtros básicos
    if (query.category) filter.category = query.category;
    if (query.status !== undefined) filter.status = query.status;

    // Rango de precios
    if (query.minPrice) {
      filter.price = { ...filter.price, $gte: Number(query.minPrice) };
    }
    if (query.maxPrice) {
      filter.price = { ...filter.price, $lte: Number(query.maxPrice) };
    }

    // Opciones de paginación y ordenamiento
    const options = {
      limit: Number(limit),
      skip: (Number(page) - 1) * Number(limit),
      sort: {},
    };

    if (sort) {
      // si viene como "asc" o "desc"
      if (sort === 'asc') options.sort.price = 1;
      else if (sort === 'desc') options.sort.price = -1;
      else {
        // si viene como "price" o "-price"
        const field = sort.replace('-', '');
        const order = sort.startsWith('-') ? -1 : 1;
        options.sort[field] = order;
      }
    }

    const products = await Product.find(filter, null, options);
    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    return {
      status: 'success',
      payload: products,
      totalDocs: total,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page: Number(page),
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}` : null,
      nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}` : null,
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

  // Incrementar stock con $inc
  async increaseStock(id, amount) {
    return await Product.findByIdAndUpdate(
      id,
      { $inc: { stock: amount } },
      { new: true }
    );
  }

  // Quitar descripción con $unset
  async removeDescription(id) {
    return await Product.findByIdAndUpdate(
      id,
      { $unset: { description: "" } },
      { new: true }
    );
  }
}

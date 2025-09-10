// routes/products.router.js
import { Router } from "express";
import ProductModel from "../models/Product.js";

const router = Router();

// GET /products con filtros, paginación y sort
router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const sort =
      req.query.sort === "asc"
        ? { price: 1 }
        : req.query.sort === "desc"
        ? { price: -1 }
        : {};

    // Construcción de filtros dinámicos
    const query = {};
    if (req.query.query) query.category = req.query.query;
    if (req.query.status !== undefined) query.status = req.query.status === "true";
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    const options = {
      page,
      limit,
      sort,
      lean: true,
    };

    const result = await ProductModel.paginate(query, options);

    // Construir prevLink y nextLink
    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const prevLink = result.hasPrevPage
      ? `${baseUrl}?page=${result.prevPage}&limit=${limit}&sort=${req.query.sort || ""}&query=${req.query.query || ""}`
      : null;
    const nextLink = result.hasNextPage
      ? `${baseUrl}?page=${result.nextPage}&limit=${limit}&sort=${req.query.sort || ""}&query=${req.query.query || ""}`
      : null;

    // 🔹 Si querés devolver JSON como API
    if (req.headers.accept?.includes("application/json")) {
      return res.json({
        status: "success",
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
    }

    // 🔹 Si querés renderizar la vista con Handlebars
    res.render("products", {
      title: "Productos",
      products: result.docs,
      totalPages: result.totalPages,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

export default router;

import { Router } from "express";
import { Product } from "../models/Product.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    // Parámetros de query
    let { limit = 10, page = 1, sort, category, status } = req.query;

    limit = parseInt(limit);
    page = parseInt(page);

    // Construir query
    const query = {};
    if (category) query.category = category;
    if (status !== undefined) query.status = status === "true";

    // Opciones de paginación
    const options = {
      page,
      limit,
      sort: sort ? { price: sort === "asc" ? 1 : -1 } : {},
      lean: true // devuelve objetos planos en vez de documentos Mongoose
    };

    // Ejecutar paginación
    const result = await Product.paginate(query, options);

    // Construir prevLink y nextLink
    const baseUrl = req.protocol + "://" + req.get("host") + req.path;
    const prevLink = result.hasPrevPage ? `${baseUrl}?page=${result.prevPage}&limit=${limit}${sort ? `&sort=${sort}` : ""}${category ? `&category=${category}` : ""}${status !== undefined ? `&status=${status}` : ""}` : null;
    const nextLink = result.hasNextPage ? `${baseUrl}?page=${result.nextPage}&limit=${limit}${sort ? `&sort=${sort}` : ""}${category ? `&category=${category}` : ""}${status !== undefined ? `&status=${status}` : ""}` : null;

    // Respuesta en formato solicitado
    res.json({
      status: "success",
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink,
      nextLink
    });
  } catch (err) {
    next(err);
  }
});

export default router;

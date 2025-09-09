// middlewares/errorHandler.js
export default (err, req, res, next) => {
  console.error(err.stack); // Para debug
  res.status(500).json({
    status: "error",
    message: err.message || "Error interno del servidor"
  });
};

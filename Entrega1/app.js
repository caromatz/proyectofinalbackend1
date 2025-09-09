import express from 'express';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import errorHandler from './middlewares/errorHandler.js';
import { connectDB } from './db.js';

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter); // Router para vistas (Handlebars)

// Middleware de manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

// Conectar a MongoDB primero, luego levantar servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}).catch(err => {
  console.error('Error al conectar a la base de datos', err);
});

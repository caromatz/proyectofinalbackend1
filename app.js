import express from 'express';
import session from 'express-session';
import handlebars from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import errorHandler from './middlewares/errorHandler.js';
import { connectDB } from './db.js';
import CartManager from './managers/CartManager.js';

const app = express();
const cartManager = new CartManager();

// Para usar __dirname con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Handlebars con partials
app.engine(
  'handlebars',
  handlebars.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials'),
  })
);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos (CSS, imágenes, JS del cliente)
app.use(express.static(path.join(__dirname, 'public')));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sesiones
app.use(
  session({
    secret: 'secreto123',
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware para generar o recuperar cartId
app.use(async (req, res, next) => {
  if (!req.session.cartId) {
    const cart = await cartManager.createCart();
    req.session.cartId = cart._id;
  }
  res.locals.cartId = req.session.cartId;
  next();
});

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

// Middleware de manejo de errores
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

// Conectar a MongoDB primero, luego levantar servidor
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos', err);
  });

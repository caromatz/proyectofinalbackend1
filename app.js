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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


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


app.use(express.static(path.join(__dirname, 'public')));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
  session({
    secret: 'secreto123',
    resave: false,
    saveUninitialized: true,
  })
);


app.use(async (req, res, next) => {
  if (!req.session.cartId) {
    const cart = await cartManager.createCart();
    req.session.cartId = cart._id;
  }
  res.locals.cartId = req.session.cartId;
  next();
});


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);


app.use(errorHandler);

const PORT = process.env.PORT || 8080;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al conectar a la base de datos', err);
  });

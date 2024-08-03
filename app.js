const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const globalErrorHandler = require('./controllers/errorController');

const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const sessionRouter = require('./routes/sessionRoutes');
const orderRouter = require('./routes/orderRoutes');
const statRouter = require('./routes/statRoutes');

const app = express();

app.enable('trust proxy');

// 1. Global middlewares
//Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());
// Implement cors
app.use(cors({
  origin: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '*',
  credentials: true,
}));
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));
// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}


app.use((req, res, next) => {
  // console.log(req.body);
  next();
});

// 2.Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/sessions', sessionRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/stats', statRouter);

// 3.Global error handler
app.use(globalErrorHandler);


module.exports = app
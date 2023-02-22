const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorHandler');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Built-in and 3rd party Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json()); // body parser
app.use(express.static(`${__dirname}/public`)); // to use static files inside public folder

// Custom Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES [Mounting]
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

/* 
These are global error handler middlewares where they'll throw an error message
for a path that's not in our stack. They are predefined inside ExpressJS and when 
any of the middleware passes an error onject inside next() function, Express knows 
and it'll skip all other middlewares and jump to the global error handler.
*/

app.all('*', (req, res, next) => {
  // const err = new Error(`Can't find ${req.originalUrl} on this server.`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // next(err);

  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

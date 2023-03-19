var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const errorResponser = require('./lib/errorResponseConfigure');

const swaggerMiddleware = require('./lib/swagggerMiddleware');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.locals.title = 'HandWebber';

require('./lib/connectMongoose');
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Rutas del API
 */
app.use('/api/users/tokenTest', require('./routes/api/tokenTest'));
app.use('/api/users/login', require('./routes/api/login'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/advertisement', require('./routes/api/advertisement'));
app.use('/api/chat', require('./routes/api/chat'));
app.use('/api-docs', swaggerMiddleware);

/**
 * Rutas del website
 */
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const error = createError(404, "This is not the page you're looking for...");
  next(error);
});

// error handler
app.use((err, req, res, next) => {
  const response = errorResponser(err, req, res);
  res.status(response.status).json(response);
});

module.exports = app;

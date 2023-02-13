'use strict';

const createError = require('http-errors');

/**
 *
 * @param {http-error} err Error message created with createHttpError
 * @param {*} req request passed by app
 * @param {*} res response passed by app
 */
function errorResponser(err, req, res) {
  const errResponse = {
    status: err.status || 500,
    message: err.message || 'internal server error',
  };

  res.status(err.status).json(errResponse);
}

module.exports = errorResponser;
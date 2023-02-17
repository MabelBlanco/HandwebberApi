'use strict';

const createError = require('http-errors');

/**
 *
 * @param {http-error} err Error message created with createHttpError
 * @param {*} req request passed by app
 * @param {*} res response passed by app
 */
function errorResponseConfigure(err) {
  return {
    status: err?.status || 500,
    message: err?.message || 'Internal Server Error',
  };
}

module.exports = errorResponseConfigure;

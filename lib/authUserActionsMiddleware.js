'use strict';

const createError = require('http-errors');

function authUserActionsMiddleware(req, res, next) {
  if (req.userId !== req.body.idUser) {
    next(createError(401, "This ads doesn't belong to this user"));
  }
  next();
}

module.exports = authUserActionsMiddleware;

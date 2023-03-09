'use strict';

const createError = require('http-errors');

function authUserActionsMiddleware(req, res, next) {
  if (req.method === 'POST' || req.method === 'PUT') {
    //TODO
    console.log('req.userId', req.userId, 'req.body.idUser', req.body);
    if (req.userId !== req.body.idUser) {
      next(createError(401, "This ads doesn't belong to this user"));
    }
  }

  next();
}

module.exports = authUserActionsMiddleware;

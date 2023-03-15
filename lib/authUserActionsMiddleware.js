'use strict';

const createError = require('http-errors');

const error = () => createError(401, "This object doesn't belong to this user");

async function authEditControl(req, action) {
  let owner;
  if (!action) return false;
  try {
    owner = await action(req.params.id);
    return req.userId === owner;
  } catch (error) {
    throw createError(500, 'Error server authenticating user property');
  }
}

function authUserActionsMiddleware(action) {
  return async function (req, res, next) {
    if (req.baseUrl === '/api/users') {
      if (req.userId !== req.params.id) {
        next(error());
        return;
      }
      next();
      return;
    }

    if (req.method === 'PUT' || req.method === 'DELETE') {
      try {
        const auth = await authEditControl(req, action);
        if (!auth) {
          next(error());
          return;
        }
      } catch (err) {
        next(err);
      }
    }

    next();
  };
}

module.exports = { authUserActionsMiddleware, authEditControl, error };

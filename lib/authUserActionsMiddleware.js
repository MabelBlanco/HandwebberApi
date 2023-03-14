'use strict';

const createError = require('http-errors');
const { Advertisement } = require('../models');

//TODO

// async function authEditControl(req) {
//   let owner;
//   try {
//     owner = await Advertisement.findAdOwner(req.params.id);
//     return req.userId === owner;
//   } catch (error) {
//     owner = null;
//   }
// }

// async function authUserActionsMiddleware(req, res, next) {
//   //req.url y req.method
//   //if (req.method === 'POST' || req.method === 'PUT') {
//   if (req.method === 'PUT') {
//     const auth = await authEditControl(req);
//     if (!auth) {
//       next(createError(401, "This ads doesn't belong to this user"));
//     }
//   }

//   next();
// }

async function authEditControl(req, action) {
  let owner;
  try {
    owner = await action(req.params.id);
    return req.userId === owner;
  } catch (error) {
    owner = null;
  }
}

function authUserActionsMiddleware(action) {
  return async function (req, res, next) {
    //TODO
    //console.log('accion', action);
    if (req.method === 'PUT' || req.method === 'DELETE') {
      const auth = await authEditControl(req, action);
      if (!auth) {
        next(createError(401, "This ads doesn't belong to this user"));
      }
    }

    next();
  };
}

module.exports = { authUserActionsMiddleware, authEditControl };

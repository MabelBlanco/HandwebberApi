'use strict';

const createError = require('http-errors');
const { body, validationResult } = require('express-validator');
const { User } = require('../../models');

class SignupController {
  validation() {
    return [
      body('username')
        .isAlphanumeric()
        .withMessage('Username must be alphanumeric'),
      body('mail').isEmail().withMessage('Insert a valid mail please'),
      body('password')
        .isLength({ min: 8 })
        .withMessage('Password min length 8 characters'),
    ];
  }

  async post(req, res, next) {
    try {
      validationResult(req).throw();
    } catch (error) {
      const err = {
        status: 422,
        message: error.array()[0].msg,
      };
      next(err);
      return;
    }

    try {
      //Capturo el body
      const user = req.body;
      //Añado los campos para la peticion
      const newUser = {
        username: user.username,
        mail: user.mail,
        password: await User.hashPassword(user.password),
        image: user.image || '',
        created: Date.now(),
        update: Date.now(),
      };

      //Hago la peticion
      const userResult = await User.create(newUser);

      //La respuesta es el documento de usuario
      res.json({ result: userResult });
    } catch (error) {
      const notAvailable = error.keyValue; // Capturo el campo del error
      const key = Object.keys(notAvailable)[0];
      const value = Object.values(notAvailable)[0];

      const message = `The ${key} ${value} is not available`;

      next(createError(409, message));
    }
  }
}

module.exports = SignupController;

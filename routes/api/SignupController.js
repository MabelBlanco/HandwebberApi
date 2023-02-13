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

  async getAllUsers(req, res, next) {
    //Extracting the data for search
    let searchParameters = User.assingSearchParameters(req);

    try {
      const result = await User.search(searchParameters.filters);

      res.status(200).json({ results: result });
    } catch (error) {
      next(createError(400, 'ERROR'));
    }
  }

  async getUserById(req, res, next) {
    try {
      const _id = req.params.id;

      const user = await User.find({ _id: _id });

      res.status(200).json({ result: user });
    } catch (error) {
      next(createError(404, 'User not found'));
    }
  }

  async postSignup(req, res, next) {
    try {
      validationResult(req).throw();
    } catch (error) {
      const err = {
        status: 422,
        message: error.array(),
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
      res.status(200).json({ result: userResult });
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

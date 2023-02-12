'use strict';

const { body, validationResult } = require('express-validator');
const { User } = require('../../models');

class SignupController {
  validation() {
    return [
      body('username').isAlphanumeric().withMessage('username required'),
      body('mail').isEmail().withMessage('Insert a valid mail please'),
      body('password').isLength({ min: 8 }).withMessage('min 8 characters'),
    ];
  }

  async post(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
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
      res.statusCode = 400; //codigo de la respuesta
      error.statusCode = 400; //modifico el codigo del error

      const notAvailable = error.keyValue; // Capturo el campo del eror
      const key = Object.keys(notAvailable)[0];
      const value = Object.values(notAvailable)[0];

      error.msg = `The ${key} ${value} is not available`;

      // construyo la respuesta
      const errorResult = {
        error: true,
        statusCode: 400,
        message: `The ${key} ${value} is not available`,
        current: { [key]: value },
      };

      //Respondo con el objeto errorResult
      res.json(errorResult);
    }
  }
}

module.exports = SignupController;

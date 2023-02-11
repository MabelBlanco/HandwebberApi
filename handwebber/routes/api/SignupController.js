'use strict';

const { validationResult } = require('express-validator');
const { User } = require('../../models');

class SignupController {
    
  async post(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {//Capturo el body
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
      next(error);
    };
  };
};

module.exports = SignupController;

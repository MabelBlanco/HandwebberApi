'use strict';

const { User } = require('../../models');
const { insertMany } = require('../../models/User');

class SignupController {
  async post(req, res, next) {
    try {//Capturo el body
      const user = req.body;
        //Añado los campos para la peticion
      const newUser = {
        username: user.username,
        mail: user.mail,
        password: user.password,
        image: user.image || '',
        created: Date.now(),
        update: Date.now(),
      };

      //Hago la peticion
      const userResult = await User.insertMany(newUser)

      //La respuesta es el documento de usuario
      res.json({ result: userResult });
    } catch (error) {
      next(error);
    };
  };
};

module.exports = SignupController;

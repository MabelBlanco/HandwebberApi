"use strict";

const createError = require("http-errors");
const { body, validationResult } = require("express-validator");
const { User } = require("../../models");
const path = require("path");
const filesEraser = require("../../lib/filesEraser");
const publisher = require("../../lib/rabbitmq/publisher");

class SignupController {
  validation() {
    return [
      body("username")
        .isAlphanumeric()
        .withMessage("Username must be alphanumeric"),
      body("mail").isEmail().withMessage("Insert a valid mail please"),
      body("password")
        .isLength({ min: 8 })
        .withMessage("Password min length 8 characters"),
    ];
  }

  updateValidation() {
    return [
      body("username")
        .if(body("username").exists())
        .isAlphanumeric()
        .withMessage("Username must be alphanumeric"),
      body("mail")
        .if(body("mail").exists())
        .isEmail()
        .withMessage("Insert a valid mail please"),
      body("password")
        .if(body("password").exists())
        .isLength({ min: 8 })
        .withMessage("Password min length 8 characters"),
    ];
  }

  async getAllUsers(req, res, next) {
    //Extracting the data for search
    let searchParameters = User.assingSearchParameters(req);

    try {
      const result = await User.search(searchParameters.filters);

      res.status(200).json({ results: result });
    } catch (error) {
      next(createError(400, "ERROR in DB"));
    }
  }

  async getUserById(req, res, next) {
    try {
      const _id = req.params.id;

      const user = await User.findById({ _id: _id });

      res.status(200).json({ result: user });
    } catch (error) {
      next(createError(404, "User not found"));
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

      //If there's a validation error, we'll erase the file uploaded
      if (req.file) {
        filesEraser(req.file);
      }

      next(err);
      return;
    }

    try {
      //Capturo el body
      const user = req.body;
      //Añado los campos para la peticion
      let image = null;
      if (req.file) {
        const destination = req.file?.destination.split("public")[1];

        image = path.join(destination, req.file?.filename);
      }
      const newUser = {
        username: user.username,
        mail: user.mail,
        password: await User.hashPassword(user.password),
        image,
        created: Date.now(),
        update: Date.now(),
      };

      //Hago la peticion
      const userResult = await User.create(newUser);

      //La respuesta es el documento de usuario
      res.status(200).json({ result: userResult });

      // Send a Welcome Email
      const messageConfig = {
        function: "sendEmail",
        email: "welcomeEmail",
        user: userResult,
      };
      publisher(messageConfig);
      //         userResult.sendEmail(
      //  "Welcome to HandWebber",
      //  welcomeEmail(userResult.username)
      //)
    } catch (error) {
      const notAvailable = error.keyValue; // Capturo el campo del error
      const key = Object.keys(notAvailable)[0];
      const value = Object.values(notAvailable)[0];

      const message = `The ${key} ${value} is not available`;

      //If there's a validation error, we'll erase the file uploaded
      if (req.file) {
        filesEraser(req.file);
      }

      next(createError(409, message));
    }
  }

  async updateUser(req, res, next) {
    try {
      validationResult(req).throw();
    } catch (error) {
      const err = {
        status: 422,
        message: error.array(),
      };

      //If there's a validation error, we'll erase the file uploaded
      if (req.file) {
        filesEraser(req.file);
      }

      next(err);
      return;
    }

    try {
      const _id = req.params.id;
      const data = req.body;

      let image = null;
      console.log(req.file);
      if (req.file) {
        const destination = req.file?.destination.split("public")[1];

        image = path.join(destination, req.file?.filename);
        data.image = image;
      }
      if (data.password) {
        data.password = await User.hashPassword(data.password);
      }

      if (data.subscriptions) {
        const user = await User.find({ _id: _id });
        const subscriptions = user[0].subscriptions;
        if (subscriptions.includes(data.subscriptions)) {
          const subscription = subscriptions.filter(
            (e) => e !== data.subscriptions
          );
          data.subscriptions = subscription;
        } else {
          subscriptions.unshift(data.subscriptions);
          data.subscriptions = subscriptions;
        }
      }

      data.update = Date.now();

      const updateUser = await User.findOneAndUpdate({ _id: _id }, data, {
        new: true, // esto hace que nos devuelva el documento actualizado
      });

      res.status(200).json({ result: updateUser });
    } catch (error) {
      if (!error.keyValue) {
        next(createError(400, "Bad Request"));
      } else {
        const notAvailable = error.keyValue; // Capturo el campo del error
        const key = Object.keys(notAvailable)[0];
        const value = Object.values(notAvailable)[0];

        const message = `The ${key} ${value} is not available`;

        next(createError(409, message));
      }
    }
  }

  async deleteUser(req, res, next) {
    try {
      const id = req.params.id;
      const users = await User.find({ _id: id });
      const userDeleted = await User.deleteOne({ _id: id });
      const { username, _id, mail } = users[0];
      const response = {
        ...userDeleted,
        username,
        _id,
        mail,
      };
      res.status(200).json({ result: response });
    } catch (error) {
      next(createError(400, "User not in DB"));
    }
  }
}

module.exports = SignupController;

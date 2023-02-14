'use strict';

const express = require('express');
const router = express.Router();
const { User } = require('../../models');
const SignupController = require('./SignupController');

const signupController = new SignupController();

/* GET users listing. */
router.get('/', signupController.getAllUsers);

/*GET user by id */
router.get('/:id', signupController.getUserById);

/* POST signup user */
router.post(
  '/signup',
  signupController.validation(),
  signupController.postSignup
);

/* PUT update user by ID */
router.put('/:id', signupController.updateValidation(), signupController.updateUser);

module.exports = router;

"use strict";

const express = require("express");
const router = express.Router();  
const upload = require('../../lib/uploadConfig');
const SignupController = require("./SignupController");
const loginRouter = require("./login");
const jwtAuthMiddleware = require('../../lib/jwtAuthMiddleware');

const signupController = new SignupController();

/* GET users listing. */
router.get("/", signupController.getAllUsers);

/*GET user by id */
router.get("/:id", signupController.getUserById);

/* POST signup user */
router.post(
  "/signup",
  upload.single('image'),
  signupController.validation(),
  signupController.postSignup
);

/* PUT update user by ID */
router.put(
  "/:id",
  jwtAuthMiddleware,
  upload.single('image'),
  signupController.updateValidation(),
  signupController.updateUser
);

/* DELETE user by ID */
router.delete("/:id", jwtAuthMiddleware,signupController.deleteUser);

/* LOGIN user*/
router.use("/login", loginRouter);

module.exports = router;

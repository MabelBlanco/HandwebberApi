"use strict";

const express = require("express");
const router = express.Router();
const upload = require("../../lib/uploadConfig");
const SignupController = require("./SignupController");
const jwtAuthMiddleware = require("../../lib/jwtAuthMiddleware");
const {
  authUserActionsMiddleware,
} = require("../../lib/authUserActionsMiddleware");

const signupController = new SignupController();

/* GET users listing. */
//router.get('/', signupController.getAllUsers);

/*GET user by id */
router.get("/:id", signupController.getPublicUserInfoById);

/*GET user by id */
router.get("/user/:username", signupController.getUserByUsername);

/*GET private user data by id */
router.get(
  "/private/:id",
  jwtAuthMiddleware,
  authUserActionsMiddleware(),
  signupController.getUserById
);

/* POST signup user */
router.post(
  "/signup",
  upload.single("image"),
  signupController.validation(),
  signupController.postSignup
);

/* PUT update user by ID */
router.put(
  "/:id",
  jwtAuthMiddleware,
  authUserActionsMiddleware(),
  upload.single("image"),
  signupController.updateValidation(),
  signupController.updateUser
);

/* DELETE user by ID */
router.delete(
  "/:id",
  jwtAuthMiddleware,
  authUserActionsMiddleware(),
  signupController.deleteUser
);

/* Recover Password */
router.put("/recover-password/:mail", signupController.recoverPassword);

module.exports = router;

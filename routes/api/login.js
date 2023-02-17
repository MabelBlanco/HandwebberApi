var express = require("express");
const router = express.Router();

const User = require("../../models/Usermodel/User");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res, next) => {
  try {
    const { mail, password } = req.body;

    const user = await User.findOne({ mail });

    if (!user) {
      const error = new Error("This email do not have an account");
      error.status = 401;
      next(error);
      return;
    }

    if (!(await user.comparePasswords(password))) {
      const error = new Error("Wrong password");
      error.status = 401;
      next(error);
      return;
    }

    // Generate JWT
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d", // 1 day
    });

    // Send to user this JWT
    res.json({ jwtToken });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

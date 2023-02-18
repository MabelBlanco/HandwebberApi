var express = require('express');
const router = express.Router();

const User = require('../../models/Usermodel/User');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

router.post('/', async (req, res, next) => {
  try {
    const { mail, password } = req.body;

    const user = await User.findOne({ mail });

    if (!user) {
      const error = createError(401, 'This email do not have an account');
      next(error);
      return;
    }

    if (!(await user.comparePasswords(password))) {
      const error = createError(401, 'Wrong password');
      next(error);
      return;
    }

    // Generate JWT
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d', // 1 day
    });

    // Send to user this JWT
    res.json(jwtToken);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

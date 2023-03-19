'use strict';

const express = require('express');
const jwtAuthMiddleware = require('../../lib/jwtAuthMiddleware');
const router = express.Router();

router.post('/', jwtAuthMiddleware, async function (req, res, next) {
  res.status(200).json(req.userId);
});

module.exports = router;

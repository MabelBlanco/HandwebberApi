'use strict';

const express = require('express');
const createError = require('http-errors');
const router = express.Router();
const { Advertisement } = require('../../models');

router.get('/', async function (req, res, next) {
  try {
    const ads = await Advertisement.search();
    res.status(200).json({ result: ads });
  } catch (error) {
    next(createError(500, 'Advertisements are not available in this moment'));
  }
});

module.exports = router;

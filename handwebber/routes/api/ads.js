'use strict';

const express = require('express');
const router = express.Router();
const { Advertisement } = require('../../models');

router.get('/', async function (req, res, next) {
  try {
    const ads = await Advertisement.search();
    res.send(ads);
  } catch (error) {}
});

module.exports = router;

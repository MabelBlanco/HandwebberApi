'use strict';

const express = require('express');
const router = express.Router();
const { User } = require('../../models');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST signup user */
router.post('/signup', )

module.exports = router;
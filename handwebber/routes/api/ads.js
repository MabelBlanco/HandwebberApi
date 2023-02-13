'use strict';

const express = require('express');
const { validationResult } = require('express-validator');
const createError = require('http-errors');
const router = express.Router();
const { Advertisement } = require('../../models');

router.get(
  '/',
  Advertisement.dataValidator('get'),
  async function (req, res, next) {
    try {
      validationResult(req).throw();
    } catch (error) {
      const err = {
        status: 422,
        message: error.array(),
      };
      next(err);
      return;
    }

    //Extracting the data for search
    let searchParameters = Advertisement.assingSearchParameters(req);

    try {
      const ads = await Advertisement.search(
        searchParameters.filters,
        searchParameters.skip,
        searchParameters.limit,
        searchParameters.sort,
        searchParameters.fields
      );
      res.status(200).json({ result: ads });
    } catch (error) {
      next(createError(500, 'Advertisements are not available in this moment'));
    }
  }
);

module.exports = router;
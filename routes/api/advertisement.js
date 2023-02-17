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

router.post(
  '/',
  Advertisement.dataValidator('post'),
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

    try {
      const advertisement = req.body;
      const defaultValues = {
        active: true,
        created: Date.now(),
        update: Date.now(),
      };
      const newAdvertisement = {
        ...defaultValues,
        ...advertisement,
      };

      //Hago la peticion
      const advertisementResult = await Advertisement.create(newAdvertisement);

      //La respuesta es el documento de usuario
      res.status(200).json({ result: advertisementResult });
    } catch (error) {
      next(
        createError(500, 'Internal Error: Impossible create the advertisement')
      );
    }
  }
);

module.exports = router;

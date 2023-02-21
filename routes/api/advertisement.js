'use strict';

const express = require('express');
const { validationResult } = require('express-validator');
const createError = require('http-errors');
const router = express.Router();
const upload = require('../../lib/uploadConfig');
const { Advertisement } = require('../../models');
const path = require('path');
const filesEraser = require('../../lib/filesEraser');
const jwtAuthMiddleware = require('../../lib/jwtAuthMiddleware');

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

router.get(
  '/:id',
  Advertisement.dataValidator('get'),
  async function (req, res, next) {
    try {
      const _id = req.params.id;
      const advert = await Advertisement.findById({ _id: _id });
      res.status(200).json({ result: advert });
      validationResult(req).throw();
    } catch (error) {
      const err = {
        status: 422,
        //message: error.array(),
      };
      next(err);
      return;
    }
  }
);

router.post(
  '/',
  jwtAuthMiddleware,
  upload.single('image'),
  Advertisement.dataValidator('post'),
  async function (req, res, next) {
    try {
      validationResult(req).throw();
    } catch (error) {
      const err = {
        status: 422,
        message: error.array(),
      };

      //If there's a validation error, we'll erase the file uploaded
      if (req.file) {
        filesEraser(req.file);
      }

      next(err);
      return;
    }

    try {
      const advertisement = req.body;
      advertisement.price = parseFloat(advertisement.price);
      const defaultValues = {
        active: true,
        created: Date.now(),
        update: Date.now(),
      };

      let image = null;
      if (req.file) {
        const destination = req.file?.destination.split('public')[1];

        image = path.join(destination, req.file?.filename);
      }
      const newAdvertisement = new Advertisement({
        ...defaultValues,
        ...advertisement,
        idUser: req.userId,
        image,
      });

      //Hago la peticion
      //const advertisementResult = await Advertisement.create(newAdvertisement);
      const advertisementResult = await newAdvertisement.save();

      //La respuesta es el documento de usuario
      res.status(200).json({ result: advertisementResult });
    } catch (error) {
      //Si falla la creación, elimino el archivo
      if (req.file) {
        filesEraser(req.file);
      }
      next(
        createError(500, 'Internal Error: Impossible create the advertisement')
      );
    }
  }
);

router.delete(
  '/:id',
    async function (req, res, next) {
      try {
        const id = req.params.id;
        const ad = await Advertisement.search({_id: id});
        const deletedAd = await Advertisement.deleteOne({_id: id});
        const response = {deletedAd, ad}  
        res.status(200).json({result: response})
      } catch (error) {
        next(createError(400, 'Advertisement not in DB'))
      }     
    } 
  );

module.exports = router;

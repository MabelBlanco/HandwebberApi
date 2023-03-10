'use strict';

const express = require('express');
const { validationResult } = require('express-validator');
const createError = require('http-errors');
const router = express.Router();
const upload = require('../../lib/uploadConfig');
const { Advertisement, User } = require('../../models');
const path = require('path');
const {
  filesEraserFromReq,
  filesEraserFromName,
} = require('../../lib/filesEraser');
const jwtAuthMiddleware = require('../../lib/jwtAuthMiddleware');
const authUserActionsMiddleware = require('../../lib/authUserActionsMiddleware');
const fs = require('fs');

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

      const totalNumOfAds = await Advertisement.count(searchParameters.filters);
      const adWithMaxPrice = await Advertisement.findAdWithMaxPrice();
      const maxPrice = adWithMaxPrice[0].price;
      const response = {
        result: ads,
        meta: {
          totalNumOfAds,
          maxPrice,
        },
      };

      res.status(200).json(response);
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
        filesEraserFromReq(req.file);
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
      const user = await User.search({ _id: req.userId });

      const idUser = {
        _id: req.userId,
        username: user[0].username,
        mail: user[0].mail,
        image: user[0].image,
      };

      const newAdvertisement = new Advertisement({
        ...defaultValues,
        ...advertisement,
        idUser,
        image,
      });

      //Hago la peticion
      const advertisementResult = await newAdvertisement.save();

      //La respuesta es el documento de usuario
      res.status(200).json({ result: advertisementResult });
    } catch (error) {
      //Si falla la creación, elimino el archivo
      if (req.file) {
        filesEraserFromReq(req.file);
      }
      next(
        createError(500, 'Internal Error: Impossible create the advertisement')
      );
    }
  }
);

router.delete('/:id', jwtAuthMiddleware, async function (req, res, next) {
  try {
    const id = req.params.id;
    const ad = await Advertisement.search({ _id: id });
    if (req.userId !== ad[0].idUser._id) {
      throw createError(401, 'This ad is not your property');
    }
    const deletedAd = await Advertisement.deleteOne({ _id: id });
    const response = { deletedAd, ad };
    filesEraserFromName(ad[0].image);
    res.status(200).json({ result: response });
  } catch (error) {
    if (error.status === 401) {
      next(error);
      return;
    }
    console.log(error);
    next(createError(400, 'Advertisement not in DB'));
  }
});

// Actualizar un anuncio
// PUT => localhost:3001/api/advertisement/_id
router.put(
  '/:id',
  jwtAuthMiddleware,
  upload.single('image'),
  authUserActionsMiddleware,
  Advertisement.dataValidator('put'),
  async (req, res, next) => {
    try {
      validationResult(req).throw();
    } catch (error) {
      const err = {
        status: 422,
        message: error.array(),
      };

      //If there's a validation error, we'll erase the file uploaded
      if (req.file) {
        filesEraserFromReq(req.file);
      }
      next(err);
      return;
    }

    try {
      const _id = req.params.id;
      const { idUser, ...data } = req.body;

      let image = req.file;
      let newImage;

      if (req.file) {
        const destination = req.file?.destination.split('public')[1];
        newImage = path.join(destination, req.file?.filename);
      }
      data.price = parseFloat(data.price);

      if (image) {
        const adToErase = await Advertisement.search({ _id: _id });
        let imageToErase = adToErase[0].image;
        filesEraserFromName(imageToErase);
      }

      let newData = {
        ...data,
        update: Date.now(),
      };
      if (newImage) {
        newData.image = newImage;
      }

      const updatedAdvertisement = await Advertisement.findOneAndUpdate(
        { _id: _id },
        newData,
        {
          new: true, // esto hace que nos devuelva el documento actualizado
        }
      );
      res.json({ result: updatedAdvertisement });
      //createThumbnail(data.image);
    } catch (error) {
      next(createError(error));
    }
  }
);

module.exports = router;

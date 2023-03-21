"use strict";

const express = require("express");
const { validationResult } = require("express-validator");
const createError = require("http-errors");
const router = express.Router();
const upload = require("../../lib/uploadConfig");
const { Advertisement, User, Conversation } = require("../../models");
const path = require("path");
const {
  filesEraserFromReq,
  filesEraserFromName,
} = require("../../lib/filesEraser");
const jwtAuthMiddleware = require("../../lib/jwtAuthMiddleware");
const {
  authUserActionsMiddleware,
} = require("../../lib/authUserActionsMiddleware");
const fs = require("fs");
const { eventEmitter, Events } = require("../../lib/eventEmitter");
const publisher = require("../../lib/rabbitmq/publisher");

router.get(
  "/",
  Advertisement.dataValidator("get"),
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
      next(createError(500, "Advertisements are not available in this moment"));
    }
  }
);

router.get(
  "/:id",
  Advertisement.dataValidator("get"),
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
  "/",
  jwtAuthMiddleware,
  upload.single("image"),
  Advertisement.dataValidator("post"),
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
        const destination = req.file?.destination.split("public")[1];

        image = path.join(destination, req.file?.filename);
      }
      const user = await User.search({ _id: req.userId });

      const idUser = {
        _id: req.userId,
        username: user[0].username,
      };

      advertisement.tags = advertisement.tags.split(",");

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
        createError(500, "Internal Error: Impossible create the advertisement")
      );
    }
  }
);

router.delete(
  "/:id",
  jwtAuthMiddleware,
  authUserActionsMiddleware(Advertisement.findAdOwner),
  async function (req, res, next) {
    try {
      const id = req.params.id;
      const ad = await Advertisement.search({ _id: id });
      if (req.userId !== ad[0].idUser._id) {
        throw createError(401, "This ad is not your property");
      }
      const deletedAd = await Advertisement.deleteOne({ _id: id });

      const subscriptors = ad[0].subscriptions;
      for (let subscriptor of subscriptors) {
        const updateSubscriptor = await User.findById(subscriptor);
        const updatedSubscriptor = updateSubscriptor.subscriptions.filter(
          (e) => e !== id
        );
        const updateSubscriptions = { subscriptions: updatedSubscriptor };
        const newSubscriptions = await User.findOneAndUpdate(
          { _id: subscriptor },
          updateSubscriptions,
          { new: true }
        );
      }

      const response = { deletedAd, ad };
      filesEraserFromName(ad[0].image);

      // Delete conversations too
      await Conversation.deleteMany({
        advertisement: id,
      });

      res.status(200).json({ result: response });
    } catch (error) {
      if (error.status === 401) {
        next(error);
        return;
      }
      next(createError(400, "Advertisement not in DB"));
    }
  }
);

//const prueba = upload.single('image');
// Actualizar un anuncio
// PUT => localhost:3001/api/advertisement/_id
router.put(
  "/:id",
  jwtAuthMiddleware,
  upload.single("image"),
  // (req, res, next) => {
  //   upload.single('image')(req, res, function (err) {
  //     if (err) {
  //       const error = createError(415, err.message);
  //       next(error);
  //       return;
  //     }
  //     next();
  //   });
  //   next();
  // },
  authUserActionsMiddleware(Advertisement.findAdOwner),
  Advertisement.dataValidator("put"),
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
        const destination = req.file?.destination.split("public")[1];
        newImage = path.join(destination, req.file?.filename);
      }
      data.price = parseFloat(data.price);

      // Notifications and emails
      const oldAdvert = await Advertisement.findById(_id);
      const subscriptors = await User.find({ subscriptions: _id });

      // We compare the current price with the previous one, and notification user if Price Drop
      if (oldAdvert.price > data.price) {
        subscriptors.forEach((subscriptor) => {
          // send notification
          eventEmitter.emit(Events.PRICE_DROP, {
            subscriptor,
            oldAdvert,
            newPrice: data.price,
          });

          //send e-mail
          const messageConfig = {
            function: "sendEmail",
            email: "favoritesPriceDrop",
            user: subscriptor,
            advert: oldAdvert,
            newPrice: data.price,
          };
          publisher(messageConfig);
        });
      }

      // Notification if stock = 0
      if (oldAdvert.stock > 0 && data.stock === "0") {
        subscriptors.forEach((subscriptor) => {
          //send notification
          eventEmitter.emit(Events.OUT_OF_STOCK, {
            subscriptor,
            oldAdvert,
          });

          //send e-mail
          const messageConfig = {
            function: "sendEmail",
            email: "favoritesOutOfStock",
            user: subscriptor,
            advert: oldAdvert,
          };
          publisher(messageConfig);
        });
      }

      // Notification if back in stock
      if (oldAdvert.stock === 0 && data.stock > 0) {
        subscriptors.forEach((subscriptor) => {
          //send notification
          eventEmitter.emit(Events.BACK_IN_STOCK, {
            subscriptor,
            oldAdvert,
          });

          //send e-mail
          const messageConfig = {
            function: "sendEmail",
            email: "favoritesBackInStock",
            user: subscriptor,
            advert: oldAdvert,
          };
          publisher(messageConfig);
        });
      }

      // Notification if turn no active
      if (oldAdvert.active === true && data.active === "false") {
        subscriptors.forEach((subscriptor) => {
          //send notification
          eventEmitter.emit(Events.TURN_NO_ACTIVE, {
            subscriptor,
            oldAdvert,
          });

          //send e-mail
          const messageConfig = {
            function: "sendEmail",
            email: "favoritesTurnNoActive",
            user: subscriptor,
            advert: oldAdvert,
          };
          publisher(messageConfig);
        });
      }

      // Notification if no active advert turn of active
      if (oldAdvert.active === false && data.active === "true") {
        subscriptors.forEach((subscriptor) => {
          //send notification
          eventEmitter.emit(Events.TURN_ACTIVE, {
            subscriptor,
            oldAdvert,
          });

          //send e-mail
          const messageConfig = {
            function: "sendEmail",
            email: "favoritesTurnActive",
            user: subscriptor,
            advert: oldAdvert,
          };
          publisher(messageConfig);
        });
      }

      if (image) {
        const adToErase = await Advertisement.search({ _id: _id });
        let imageToErase = adToErase[0].image;
        filesEraserFromName(imageToErase);
      }

      data.tags = data.tags.split(",");

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

// añadir o quitar de favoritos
// PUT => http://localhost:3000/api/advertisement/id/subscriptions
router.put(
  "/:id/adssubscriptions",
  upload.single("image"),
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
      console.log("datos recibidos", data);

      let image = req.file;
      let newImage;

      if (req.file) {
        const destination = req.file?.destination.split("public")[1];
        newImage = path.join(destination, req.file?.filename);
      }
      data.price = parseFloat(data.price);

      if (image) {
        const adToErase = await Advertisement.search({ _id: _id });
        let imageToErase = adToErase[0].image;
        filesEraserFromName(imageToErase);
      }
      console.log(data.subscriptions);
      data.subscriptions
        ? (data.subscriptions = data.subscriptions.split(","))
        : (data.subscriptions = []);
      //      data.subscriptions = data.subscriptions.split(',');

      let newData = {
        ...data,
      };
      console.log("datos nuevos", newData);
      if (newImage) {
        newData.image = newImage;
      }

      const updateSubscriptions = await Advertisement.findOneAndUpdate(
        { _id: _id },
        newData,
        {
          new: true, // esto hace que nos devuelva el documento actualizado
        }
      );
      res.json({ result: updateSubscriptions });
      //createThumbnail(data.image);
    } catch (error) {
      next(createError(error));
    }
  }
);

module.exports = router;

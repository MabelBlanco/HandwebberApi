'use strict';

const express = require('express');
const router = express.Router();
const { Advertisement } = require("../../models");

router.get('/', async function (req, res, next) {
    /* const anuncios = await Advertisement.find();
    const tagsList = [];
    for(let anuncio of anuncios){
      for(let tag of anuncio.tags){
        tagsList.push(tag);
      };
    };
  
    const tags = [...new Set(tagsList)].join(' , '); */

    const tags = ['lifestyle', 'sport', 'motor', 'players'];

    res.status(200).json({result: tags})
});

module.exports = router;
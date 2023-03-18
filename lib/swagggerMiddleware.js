'use strict';

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Swagger HandWebber-API - OpenAPI 3.0',
      version: '1.0',
      description: 'API doc for handWebber application',
      contact: {
        description: 'handWebber main page',
        url: 'http://54.84.80.202',
      },
    },
  },
  apis: ['swagger.yaml'],
};

const specification = swaggerJSDoc(options);

module.exports = [swaggerUI.serve, swaggerUI.setup(specification)];

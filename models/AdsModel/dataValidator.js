'use strict';

const { query, body } = require('express-validator');

/**
 *
 * @param {string} method Http method which the request params are in (get, post...)
 * @returns
 */
module.exports = function adDataValidator(method) {
  const methodLow = method.toLowerCase();
  //GET fields in query
  if (methodLow === 'get') {
    return [
      //Search fields
      query('name')
        .if(query('name').exists())
        .isString()
        .toLowerCase()
        .withMessage('name must exists and being an string'),
      query('price')
        .if(query('price').exists())
        .custom((value) => {
          const rexExpPattern = new RegExp(
            '([0-9]{1,7}-[0-9]{1,7}|[0-9]{1,7}-|[0-9]{1,7}|-[0-9]{1,7}){1}'
          );
          return rexExpPattern.test(value);
        })
        .withMessage(
          'price must be as pattern ([0-9]{1,7}-[0-9]{1,7}|[0-9]{1,7}-|[0-9]{1,7}|-[0-9]{1,7}){1}'
        ),
      query('tag')
        .if(query('tag').exists())
        .isString()
        .toLowerCase()
        .withMessage('tag must be an string'),
      query('idUser')
        .if(query('idUser').exists())
        .isString()
        .notEmpty()
        .withMessage('idUser must be a not empty string'),

      //Pagination fields
      query('skip')
        .if(query('skip').exists())
        .isInt()
        .withMessage('skip must be an integer number'),
      query('limit')
        .if(query('limit').exists())
        .isInt()
        .withMessage('limit must be an integer number'),
      //Sort field
      query('sort')
        .if(query('sort').exists())
        .toLowerCase()
        .isIn(['name', '-name', 'price', '-price', 'update', '-update'])
        .withMessage('You can only sort by: (-)name, (-)price, (-)update'),
    ];
  }
  //Post and put fields
  if (methodLow === 'post' || methodLow === 'put') {
    return [
      body('active')
        .if(body('active').exists())
        .isBoolean()
        .withMessage('active must exists and being boolean'),
      body('name')
        .exists()
        .isString()
        .toLowerCase()
        .withMessage('nombre must exist and be an string '),
      body('image')
        .if(body('image').exists())
        .isString()
        .toLowerCase()
        .withMessage('image must be a path driving to the image'),
      body('description')
        .exists()
        .isString()
        .withMessage('description of the element must be provided'),
      body('custom')
        .exists()
        .isBoolean()
        .withMessage('custom must exists and being boolean'),
      body('stock')
        .if(body('stock').exists())
        .isInt()
        .withMessage('stock must be integer'),
      body('price')
        .exists()
        .isFloat()
        .withMessage('price must exists and being float'),
      body('tags')
        .custom((value) => {
          return false || typeof value === 'string' || Array.isArray(value);
        })
        .withMessage(
          `tags must be an array of strings containing one tag at least`
        ),
      body('stock')
        .if(body('stock').exists())
        .isString()
        .withMessage('idUser must be a string'),
    ];
  }
};

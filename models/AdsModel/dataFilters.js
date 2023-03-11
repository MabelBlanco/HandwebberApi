'use strict';

/**
 * Function to prepare price integer filter query to be use in mongoDB.
 *
 * This function is only for internal use
 * @param {string} price String
 * @returns integer or object
 *
 * This function receips one string containing:
 *  one number;
 *  two numbers, separates by '-' without spaces;
 *  one number before '-' without spaces;
 *  one number after '-' without spaces.
 *
 * Returns:
 * If price is one number, the function returns the number in integer format;
 * If price are two numbers --> objetct containing
 *  {$gte: first number, $lte: second number};
 * If price is number+'-' --> object {$gte: number};
 * If price is '-'+number --> object {$lte: number}
 */
function priceFilter(price) {
  if (price) {
    let query;
    let limits = price.split('-');

    if (limits.length === 1) {
      query = parseInt(limits[0]);
    } else {
      query = {};
      if (limits[0] !== '') {
        query = { $gte: parseInt(limits[0]) };
      }
      if (limits[1] !== '') {
        query.$lte = parseInt(limits[1]);
      }
    }
    return query;
  }
}

/**
 * Static method
 * Take from the request the necessary data for prepare filters,
 * pagination, sort, limits and skip, to be use in the search
 * function of the model.
 * @param {object} req Web Request
 * @returns objetc containing the results to apply for searching in DB.
 */
module.exports = function assingSearchParameters(req) {
  let data = {};

  //Filter assing
  let filters = {};
  if (req.query.name) {
    filters.name = { $regex: req.query.name.toLowerCase(), $options: 'i' };
  }
  if (req.query.tag) {
    filters.tags = { $regex: req.query.tag.toLowerCase(), $options: 'i' };
  }
  if (req.query.price) {
    filters.price = priceFilter(req.query.price);
  }
  if (req.query.idUser) {
    const idUserProperty = 'idUser._id';

    filters = { ...filters, [idUserProperty]: req.query.idUser };
  }

  data.filters = filters;

  //Pagination
  data.skip = req.query.skip;
  data.limit = req.query.limit;

  //Sort
  data.sort = req.query.sort;

  //Fields
  data.fields = req.query.fields;

  return data;
};

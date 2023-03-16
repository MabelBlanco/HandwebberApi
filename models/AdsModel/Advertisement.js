'use strict';
const User = require('../UserModel/User');

const mongoose = require('mongoose');
const dataValidator = require('./dataValidator');
const assingSearchParameters = require('./dataFilters');

//Esquema
const adSchema = mongoose.Schema({
  active: { type: Boolean, required: true, default: true },
  name: { type: String, required: true },
  image: { type: String, required: false },
  description: { type: String, required: true },
  custom: { type: Boolean, required: true, default: false },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  tags: { type: Array, required: true },
  idUser: {
    _id: { type: String, required: true },
    username: { type: String, required: true },
  },
  creation: { type: Date, default: Date.now },
  update: { type: Date, default: Date.now },
});

//DB indexes
adSchema.index({ name: 1 });
adSchema.index({ name: -1 });
adSchema.index({ price: 1 });
adSchema.index({ price: -1 });
adSchema.index({ tags: 1 });
adSchema.index({ tags: -1 });
adSchema.index({ update: 1 });
const idUserProperty = 'idUser._id';
adSchema.index({ [idUserProperty]: 1 });
adSchema.index({ [idUserProperty]: -1 });

/**
 *
 * @param {object} filters Possible filters: name, price, tag
 * @param {integer} skip Show result from skip+1
 * @param {integer} limit Show only "limit" results
 * @param {string} sort Sort results by the indicated property
 * @param {string} fields Return only the indicated fields
 * @returns {object} JSON containing the search results in DB
 */
adSchema.statics.search = function (filters, skip, limit, sort, fields) {
  const query = Advertisement.find(filters);

  query.skip(skip);
  query.limit(limit);
  query.sort(sort);
  query.select(fields);

  return query.exec();
};
adSchema.statics.findAdWithMaxPrice = async function () {
  const query = Advertisement.find();
  query.sort({ price: -1 });
  query.limit(1);
  return query.exec();
};

adSchema.statics.findAdOwner = async function (adId) {
  const query = Advertisement.findById(adId);
  const result = await query.exec();
  return result.idUser._id;
};

adSchema.statics.dataValidator = dataValidator;
adSchema.statics.assingSearchParameters = assingSearchParameters;

//Crear modelo
const Advertisement = mongoose.model('Advertisement', adSchema);

//Exportar modelo
module.exports = Advertisement;

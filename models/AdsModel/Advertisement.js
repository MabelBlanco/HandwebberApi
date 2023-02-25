'use strict';

const mongoose = require('mongoose');
const dataValidator = require('./dataValidator');
const assingSearchParameters = require('./dataFilters');

//Esquema
const adSchema = mongoose.Schema({
  active: { type: Boolean, required: true, default: true },
  name: { type: String, required: true },
  image: { type: String },
  description: { type: String, required: true },
  custom: { type: Boolean, required: true, default: false },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  tags: { type: Array, required: true },
  idUser: { type: String, required: true },
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

adSchema.statics.dataValidator = dataValidator;
adSchema.statics.assingSearchParameters = assingSearchParameters;

//Crear modelo
const Advertisement = mongoose.model('Advertisement', adSchema);

//Exportar modelo
module.exports = Advertisement;

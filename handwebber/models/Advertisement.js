'use strict';

const mongoose = require('mongoose');

//Esquema
const adSchema = mongoose.Schema({
  active: { type: Boolean, required: true, default: true },
  name: { type: String, required: true },
  image: { type: String },
  description: { type: String, required: true },
  custom: { type: Boolean, required: true, default: false },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  tag: { type: String, required: true },
  subscriptions: [String],
  creation: { type: Date, default: Date.now },
  update: { type: Date, default: Date.now },
});

adSchema.statics.search = function (filters, skip, limit, sort, fields) {
  const query = Advertisement.find(filters);

  query.skip(skip);
  query.limit(limit);
  query.sort(sort);
  query.select(fields);

  return query.exec();
};

//Crear modelo
const Advertisement = mongoose.model('Advertisement', adSchema);

//Exportar modelo
module.exports = Advertisement;

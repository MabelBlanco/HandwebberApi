'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const assingSearchParameters = require('./dataFilters');

//Esquema
const userSchema = mongoose.Schema({
    username: { type: String, unique: true, required: true },
    mail: { type: String, unique: true, required: true },
    password: { type: String, required: true},
    image: String,
    subscriptions: [String],
    creation: { type: Date, default: Date.now },
    update: { type: Date, default: Date.now }
});

//DB indexes
userSchema.index({ subscriptions: 1});
userSchema.index({ subscriptions: -1});
userSchema.index({ update: 1});

userSchema.statics.search = function (filters) {
    const query = User.find(filters);

    return query.exec();
};

userSchema.statics.assingSearchParameters = assingSearchParameters;

// método estático para hashear password
userSchema.statics.hashPassword = function(passwordEnClaro) {
    return bcrypt.hash(passwordEnClaro, 7);
};

//Crear modelo
const User = mongoose.model('User', userSchema);

//Exportar modelo
module.exports = User;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//Esquema
const userSchema = mongoose.Schema({
    username: { type: String, unique: true },
    mail: { type: String, unique: true },
    password: String,
    image: String,
    subscriptions: [String],
    creation: { type: Date, default: Date.now },
    update: { type: Date, default: Date.now }
});

// método estático para hashear password
userSchema.statics.hashPassword = function(passwordEnClaro) {
    return bcrypt.hash(passwordEnClaro, 7);
};

//Crear modelo
const User = mongoose.model('User', userSchema);

//Exportar modelo
module.exports = User;
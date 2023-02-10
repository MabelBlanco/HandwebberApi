const mongoose = require('mongoose');

//Esquema
const userSchema = mongoose.Schema({
    username: String,
    mail: String,
    password: String,
    image: String,
    subscriptions: Array,
    creation: { type: Date, default: Date.now },
    update: { type: Date, default: Date.now }
});
//Crear modelo
const User = mongoose.model('User', userSchema);

//Exportar modelo
module.exports = User;
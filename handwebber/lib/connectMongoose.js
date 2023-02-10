const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

const DATABASE_URI = 'mongodb://127.0.0.1/handwebber';

mongoose.connection.on('error', err => {
    console.log('Error de conexión', err);
    process.exit(1);
});

mongoose.connection.once('open', () => {
    console.log('Conectado a MongoDB en', mongoose.connection.name);
});

mongoose.connect(DATABASE_URI);

mongoose.set('strictQuery', true);

module.exports = mongoose.connection;
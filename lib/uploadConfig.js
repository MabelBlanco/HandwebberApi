'use strict';

const multer = require('multer');
const path = require('path');

// Configuración de Upload

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const root = path.join(__dirname, '..', 'uploads');
        cb(null, root);
    },
    filename: function(req, file, cb) {
        const filename = file.fieldname + '-' + file.originalname;
        cb(null, filename);
    }
});

module.exports = multer({ storage });
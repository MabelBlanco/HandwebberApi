'use strict';

const multer = require('multer');
const path = require('path');

// Configuración de Upload
const root = path.join(__dirname, '..', 'public', 'uploads');

//Pasamos directamente el string a destination para que nos cree la carpeta si no existe
const storage = multer.diskStorage({
  destination: root,
  filename: function (req, file, cb) {
    const filename =
      file.fieldname + '-' + Date.now() + '-' + file.originalname;
    cb(null, filename);
  },
});

module.exports = multer({ storage });

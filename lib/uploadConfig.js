'use strict';

const createHttpError = require('http-errors');
const multer = require('multer');
const path = require('path');
const MAX_FILES_SIZE = process.env.MAX_FILES_SIZE_MB * Math.pow(1024, 2);

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

const fileFilter = (req, file, cb) => {
  const typeFile = file.mimetype.split('/', 1);
  const type = typeFile[0];
  if (type != 'image') {
    return cb(new createHttpError(415, 'The file must be an image'));
  }
  cb(null, true);
};

module.exports = multer({
  storage,
  limits: { fileSize: MAX_FILES_SIZE },
  fileFilter,
});

'use strict';

const path = require('path');
const fs = require('fs');

const filesEraser = (reqFile) => {
  const fileName = reqFile?.destination + '/' + reqFile?.filename;
  fs.unlink(fileName, (err) => {
    console.log(err);
  });
};

module.exports = filesEraser;

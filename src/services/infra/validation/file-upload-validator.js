'use strict';

const {validate, joi} = require('./abstract-validator');
const {object} = joi;

function fileUpload() {
  return validate({
    files: {
      file: object.required()
    }
  });
}

module.exports = {
  fileUpload
};

'use strict';

const router = require('express').Router();
const validate = require('../services/infra/validation/file-upload-validator');

const fileUpload = require('express-fileupload');
const {protect} = require('../config/middleware-config');
const {handle} = require('./custom/request-common');

const path = '/api/file-upload';
router.use(protect, fileUpload(null));

router.post(`${path}/example/:id/test`,
  validate.fileUpload(),
  handle(async req => console.log(req.files.file)));

module.exports = router;

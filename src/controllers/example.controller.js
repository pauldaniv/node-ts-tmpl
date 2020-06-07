'use strict';

const router = require('express').Router();

const validate = require('../services/infra/validation/abstract-validator');

const {protect} = require('../config/middleware-config');
const {handle, withRole} = require('./custom/request-common');

const {
  getAll,
  getOne,
  update,
} = require('../services/example.service');

const path = '/api/example';
router.use(path, protect);

router.get(path,
  handle(async () => getAll()));

router.get(`${path}/:id`,
  validate.getOneWithNumber(),
  handle(async req => getOne(req.params['id'])));

router.post(`${path}/topics`,
  withRole("example-role"),
  handle(() => update()));

module.exports = router;

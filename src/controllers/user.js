'use strict';

const validate = require('../services/infra/validation/abstract-validator');

const router = require('express').Router();
const userService = require('../services/user.service');
const {protect} = require('../config/middleware-config');
const {handle} = require('./custom/request-common');

const path = '/api/users';
router.use(path, protect);

router.get(path,
  handle(() => userService.getAll()));

router.get(`${path}/current/details`,
  handle(async req => req.userDetails));

router.get(`${path}/:id`,
  validate.common.getOneWithString(),
  handle(req => userService.getOne(req.params['id'])));

module.exports = router;

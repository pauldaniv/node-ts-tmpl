'use strict';

const router = require('express').Router();
const validate = require('../services/infra/validation/abstract-validator');

const {protect} = require('../config/middleware-config');
const {handle} = require('./custom/request-common');

const {deleteOne, getAll, getUnseen, setSeen, deleteAll} = require('../services/notification.service');

const path = '/api/notifications';
router.use(path, protect);

router.get(path,
  handle(req => getAll(req.userDetails)));

router.get(`${path}/unseen`,
  handle(req => getUnseen(req.userDetails)));

router.patch(`${path}/seen`,
  validate.arrayBody(),
  handle(req => setSeen(req.userDetails, req.body)));

router.delete(`${path}/:id`,
  validate.getOneWithNumber(),
  handle(req => deleteOne(req.userDetails, req.params['id'])));

router.delete(path, handle(req => deleteAll(req.userDetails)));

module.exports = router;

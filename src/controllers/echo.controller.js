'use strict';

const router = require('express').Router();

const {handle} = require('./custom/request-common');

const path = '/api/echo';

router.use(path, handle(req => req.body));

module.exports = router;

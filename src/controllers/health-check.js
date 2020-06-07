'use strict';

const router = require('express').Router();
const {protect} = require('../config/middleware-config');
const env = process.env.NODE_ENV || 'development';
const conf = require('../config/app-config');
const path = '/healthCheck';

router.get(`${path}`, async (req, res) => {
  res.send({status: "App is running", profile: env});
});

router.get(`${path}/secure`, protect, async (req, res) => {
  return res.send({
    message: 'App is running',
    request: req.userDetails,
    conf
  });
});

module.exports = router;

'use strict';

const router = require('express').Router();

const {protect} = require('../config/middleware-config');

const path = '/api/file-download';
router.use(protect);

router.get(`${path}/example`,
  async (req, res) => res.download('./resources/test_file.txt'));

module.exports = router;

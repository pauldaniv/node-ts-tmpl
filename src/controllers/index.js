'use strict';

const router = require('express').Router();
const fs = require('fs');
const {basename} = require('path');

const mustBeFirst = ['health-check'];
const mustBeLast = ['file-upload', 'file-download'];

const controllersNames = fs.readdirSync(__dirname)
  .filter(it => it.indexOf('.') !== 0)
  .filter(it => it !== basename(__filename))
  .filter(it => it.slice(-3) === '.js')
  .filter(it => !it.includes('health-check'))
  .filter(it => !it.includes('file'));

controllersNames.unshift(...mustBeFirst);
controllersNames.push(...mustBeLast);

controllersNames.map(it => require(`./${it}`)).forEach(it => router.use(it));

module.exports = router;

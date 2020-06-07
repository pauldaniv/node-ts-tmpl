'use strict';

const session = require('express-session');

const memoryStore = new session.MemoryStore();

module.exports = {
  protect: (req, res, next) => next(),
  theMiddleware: (req, res, next) => next(),
  memoryStore
};

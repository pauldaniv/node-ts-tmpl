'use strict';

const {DomainError} = require('./domain-exception');

function printStackTrace(err) {
  console.log(err);
}

module.exports = [
  (err, req, res, next) => {
    printStackTrace(err);
    next(err);
  },
  (err, req, res, next) => {
    if (err instanceof DomainError) {
      res.status(err.statusCode).send({message: err.message});
    } else next(err);
  },
  (err, req, res, next) => {
    if (err instanceof Error) {
      res.status(500).send({message: err.message});
    } else next(err);
  }
];

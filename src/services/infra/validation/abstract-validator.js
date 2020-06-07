'use strict';

const Joi = require('@hapi/joi');
const {RequestEntityValidationError} = require('../../../handler/exceptions/domain-exception');

const joi = {
  any: Joi.any(),
  object: Joi.object(),
  array: Joi.array(),
  number: Joi.number(),
  string: Joi.string(),
  boolean: Joi.boolean()
};

const {string} = joi;
const numberId = string.regex(/^[0-9]/).required();
const stringId = string.required();

function validate(schema) {

  return function validateRequest(req, res, next) {
    const toValidate = {};
    if (!schema) {
      return next();
    }

    ['params', 'body', 'query', 'files'].forEach(function (key) {
      if (schema[key]) {
        toValidate[key] = req[key];
      }
    });

    const {error} = Joi.object(schema).validate(toValidate);
    if (error) throw new RequestEntityValidationError(error.message);
    return next();
  };
}

const common = {
  getOneWithNumber() {
    return validate({params: {id: numberId}});
  },
  getOneWithString() {
    return validate({params: {id: stringId}});
  },
  arrayBody() {
    return validate({body: joi.array});
  }
};

module.exports = {
  validate,
  common,
  ...common,
  id: {
    number: numberId,
    string: stringId
  },
  joi
};

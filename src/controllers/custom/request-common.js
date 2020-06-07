'use strict';

const {BadRequestError} = require('../../handler/exceptions/domain-exception');

module.exports = {
  handle: toBeCalled => {
    return async (req, res, next) => {
      try {
        const result = toBeCalled(req, res);
        if (result instanceof Promise) {
          return result
            .then(data => res.send(data))
            .catch(err => next(err));
        }
      } catch (e) {
        return next(e);
      }
      next();
    };
  },
  withRole: (...roles) => {
    return (req, res, next) => {
      if (!roles.some(it => req.userDetails.hasRole(it))) throw new BadRequestError('Permission denied', 403);
      next();
    };
  }
};

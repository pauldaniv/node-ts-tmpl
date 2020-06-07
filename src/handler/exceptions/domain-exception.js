'use strict';

class DomainError extends Error {
  constructor(message, statusCode) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class AppError extends DomainError {
  constructor(message, statusCode = 500) {
    super(message, statusCode);
  }
}

class BadRequestError extends DomainError {
  constructor(message, statusCode = 400) {
    super(message, statusCode);
  }
}

class PermissionDeniedError extends DomainError {
  constructor(message, statusCode = 403) {
    super(message, statusCode);
  }
}

class RequestEntityValidationError extends BadRequestError {
  constructor(message, statusCode = 422) {
    super(message, statusCode);
  }
}

module.exports = {
  AppError,
  BadRequestError,
  PermissionDeniedError,
  RequestEntityValidationError,
  DomainError
};

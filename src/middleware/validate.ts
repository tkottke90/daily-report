import express from 'express';
import { LoggerService } from '../services';
import { Schema, ValidationOptions } from 'joi';
import { BadRequestError } from '../utilities';

const defaultOptions: ValidationOptions = {
  abortEarly: false,
  stripUnknown: true
};

export function ValidateBody(schema: Schema, options: ValidationOptions = {}) {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const validationOptions = Object.assign(defaultOptions, options);
    const validationResult = schema.validate(req.body, validationOptions);

    if (validationResult.error) {
      return next(
        new BadRequestError(
          `BodyValidationError: ${validationResult.error.message}`
        )
      );
    }

    if (validationResult.warning) {
      LoggerService.log(
        'info',
        validationResult.warning.message,
        validationResult.warning
      );
    }

    req.body = validationResult.value;

    next();
  };
}

export function ValidateParam(
  param: string,
  schema: Schema,
  options: ValidationOptions = {}
) {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const validationOptions = Object.assign(defaultOptions, options);
    const validationResult = schema.validate(
      req.params[param],
      validationOptions
    );

    if (validationResult.error) {
      next(
        new BadRequestError(
          `ParamValidationError: ${validationResult.error.message}`
        )
      );
    }

    if (validationResult.warning) {
      LoggerService.log(
        'info',
        validationResult.warning.message,
        validationResult.warning
      );
    }

    req.params = validationResult.value;

    next();
  };
}

export function ValidateQuery(schema: Schema, options: ValidationOptions = {}) {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const validationOptions = Object.assign(defaultOptions, options);
    const validationResult = schema.validate(req.query, validationOptions);

    if (validationResult.error) {
      next(
        new BadRequestError(
          `QueryValidationError: ${validationResult.error.message}`
        )
      );
    }

    if (validationResult.warning) {
      LoggerService.log(
        'info',
        validationResult.warning.message,
        validationResult.warning
      );
    }

    req.query = validationResult.value;

    next();
  };
}

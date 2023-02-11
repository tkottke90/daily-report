import { Container } from '@decorators/di';
import { ERROR_MIDDLEWARE } from '@decorators/express';
import { Request, Response } from 'express';
import { LoggerService } from '../services';

export function ErrorLogger(
  error: Record<string, any>,
  request: Request,
  response: Response
) {
  LoggerService.error(error as Error);

  if (error.type === 'redirect') {
    return response.redirect('/error');
  } else if (error.code) {
    response.status(error.code).send({ message: error.message });
  } else {
    response.status(500).send(error);
  }
}

Container.provide([{ provide: ERROR_MIDDLEWARE, useValue: ErrorLogger }]);

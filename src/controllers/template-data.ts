import { Inject } from '@decorators/di';
import { Controller, Post, Response, Next } from '@decorators/express';
import { TemplateDAO } from '../dao';
import express from 'express';

@Controller('/template-data')
export class TemplateDataController {
  constructor(@Inject(TemplateDAO) private templates: TemplateDAO) {}

  @Post('/')
  createDataEntry(
    @Response() res: express.Response,
    @Next() next: express.NextFunction
  ) {
    next();
  }
}

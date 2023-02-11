import { Inject } from '@decorators/di';
import {
  Body,
  Controller,
  Delete,
  Get,
  Next,
  Params,
  Post,
  Response
} from '@decorators/express';
import express from 'express';
import { TemplateDAO } from '../dao';
import { TemplateDTO } from '../dto';
import { ValidateBody } from '../middleware';
import { TemplateValidation } from '../validation';

@Controller('/templates')
export class TemplateController {
  constructor(@Inject(TemplateDAO) private templates: TemplateDAO) {}

  @Get('/')
  async getAllTemplates(
    @Response() res: express.Response,
    @Next() next: express.NextFunction
  ) {
    try {
      res.json(this.templates.getAll());
    } catch (err) {
      next(err);
    }
  }

  @Post('/', [ValidateBody(TemplateValidation.create)])
  async createTemplate(
    @Response() res: express.Response,
    @Body() body: TemplateDTO,
    @Next() next: express.NextFunction
  ) {
    try {
      const id = this.templates.create(body);

      res.status(202).json({ id });
    } catch (err) {
      next(err);
    }
  }

  @Get('/:id')
  async getTemplateById(
    @Response() res: express.Response,
    @Params('id') id: string,
    @Next() next: express.NextFunction
  ) {
    try {
      const template = this.templates.getById(id);

      if (!template) {
        res.status(404).json({ message: 'No Template Found With That ID' });
      } else {
        res.json(template);
      }
    } catch (err) {
      next(err);
    }
  }

  @Delete('/:id')
  async deleteTemplate(
    @Response() res: express.Response,
    @Params('id') id: string,
    @Next() next: express.NextFunction
  ) {
    try {
      this.templates.delete(id);

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  @Post('/:id/test')
  async createTemplateData(
    @Response() res: express.Response,
    @Params('id') id: string,
    @Body() data: Record<string | number, string>,
    @Next() next: express.NextFunction
  ) {
    try {
      const template = this.templates.getById(id);

      if (!template) {
        res.status(404).json({ message: 'No Template Found With That ID' });
      } else {
        const result = this.templates.parseTemplate(id, data);

        res.send(result);
      }
    } catch (err) {
      next(err);
    }
  }
}

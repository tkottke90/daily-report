import { Inject } from '@decorators/di';
import {
  Body,
  Controller,
  Delete,
  Get,
  Next,
  Params,
  Patch,
  Post,
  Query,
  Response
} from '@decorators/express';
import express from 'express';
import Joi from 'joi';
import { TemplateDAO } from '../dao';
import { TemplateDTO } from '../dto';
import { ValidateBody, ValidateQuery } from '../middleware';
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
      res.json(await this.templates.getAll());
    } catch (err) {
      next(err);
    }
  }

  @Post('/', [
    ValidateBody(TemplateValidation.create),
    ValidateQuery(Joi.object({ force: Joi.boolean().optional() }))
  ])
  async createTemplate(
    @Response() res: express.Response,
    @Body() body: TemplateDTO,
    @Next() next: express.NextFunction,
    @Query('force') force?: boolean
  ) {
    try {
      const id = await this.templates.create(body, force);

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
      const template = await this.templates.getById(id);

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
      await this.templates.delete(id);

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  @Patch('/:id', [ValidateBody(TemplateValidation.update)])
  async updateTemplate(
    @Response() res: express.Response,
    @Params('id') id: string,
    @Body() data: Partial<TemplateDTO>,
    @Next() next: express.NextFunction
  ) {
    try {
      const newData = await this.templates.update(id, data);

      return res.json(newData);
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
      await this.templates.getById(id);

      const result = await this.templates.parseTemplate(id, data);
      res.send(result);
    } catch (err) {
      next(err);
    }
  }
}

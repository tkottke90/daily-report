import { Inject } from '@decorators/di';
import {
  Controller,
  Post,
  Response,
  Next,
  Body,
  Params,
  Get
} from '@decorators/express';
import { TemplateDataDAO } from '../dao';
import express from 'express';
import { TemplateDataDTO } from '../dto';
import { ValidateBody, ValidateParam } from '../middleware';
import { IdValidation, TemplateDataValidation } from '../validation';

@Controller('/template-data')
export class TemplateDataController {
  constructor(@Inject(TemplateDataDAO) private dataDao: TemplateDataDAO) {}

  @Post('/:id', [
    ValidateBody(TemplateDataValidation.create),
    ValidateParam('id', IdValidation)
  ])
  async createDataEntry(
    @Response() res: express.Response,
    @Params('id') id: string,
    @Body() body: TemplateDataDTO,
    @Next() next: express.NextFunction
  ) {
    try {
      const newEntryId = await this.dataDao.create(id, body);

      res.json({ id: newEntryId });
    } catch (error) {
      next(error);
    }
  }

  @Get('/')
  async getDataEntries(
    @Response() res: express.Response,
    @Next() next: express.NextFunction
  ) {
    try {
      res.json(await this.dataDao.getAll());
    } catch (error) {
      next(error);
    }
  }

  @Get('/:id')
  async getEntryById(
    @Response() res: express.Response,
    @Params('id') id: string,
    @Next() next: express.NextFunction
  ) {
    try {
      res.json(await this.dataDao.getById(id));
    } catch (error) {
      next(error);
    }
  }

  @Get('/template/:template')
  async getEntryByTemplate(
    @Response() res: express.Response,
    @Params('id') id: string,
    @Params('template') templateId: string,
    @Next() next: express.NextFunction
  ) {
    try {
      const records = await this.dataDao.getAll<TemplateDataDTO[]>();

      res.json(records.filter((item) => item.templateId === templateId));
    } catch (error) {
      next(error);
    }
  }
}

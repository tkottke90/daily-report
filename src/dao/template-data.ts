import { Container, Inject, Injectable, InjectionToken } from '@decorators/di';
import { NotImplementedError } from '../utilities';
import db from '../db';
import { TemplateDAO } from './template';
import { randomUUID } from 'node:crypto';
import { TemplateDataDTO } from '../dto';

const db_source = '/records';

@Injectable()
export class TemplateDataDAO {
  constructor(@Inject(TemplateDAO) private templateDao: TemplateDAO) {
    db.getOrCreate(db_source, []);
  }

  async create(templateId: string, data: Record<string, any>) {
    const dataId = randomUUID();

    const newRecord: TemplateDataDTO = {
      id: dataId,
      templateId,
      value: await this.templateDao.parseTemplate(templateId, data),
      reportDate: this.getReportDate(),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    await db.save(`${db_source}[]`, newRecord);

    return dataId;
  }

  async getAll<T>() {
    return await db.get<T>(db_source);
  }

  async getById(id: string) {
    return await db.getArrayItem(db_source, id);
  }

  async update<T>(id: string, input: Partial<T>) {
    throw new NotImplementedError('This method is not implemented');
  }

  async delete(id: string) {
    throw new NotImplementedError('This method is not implemented');
  }

  private getReportDate() {
    const today = new Date();

    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  }
}

Container.provide([
  { provide: new InjectionToken('TemplateDataDAO'), useClass: TemplateDataDAO }
]);

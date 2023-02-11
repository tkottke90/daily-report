import { Container, Inject, Injectable, InjectionToken } from '@decorators/di';
import { randomUUID } from 'node:crypto';
import { TemplateDTO } from '../dto';
import { ConflictError, NotFoundError } from '../utilities';
import { get } from 'lodash';
import { DataSource } from '../db';

const interpolationRegex = /\$\{[\w\d]*\}/gm;
const labelRegex = /\$\{([\w\d]*)\}/gm;
const db_source = '/templates';

const TemplateNotFoundError = new NotFoundError('Template With ID Not Found');

@Injectable()
export class TemplateDAO {
  constructor(@Inject(DataSource) private db: DataSource) {
    db.getOrCreate(db_source, {});
  }

  async create(dto: TemplateDTO, force = false) {
    const templateMap = await this.db.get<Record<string, TemplateDTO>>(
      db_source
    );
    const matchedTemplates = Object.entries(templateMap).filter(
      ([, value]) => value.name === dto.name
    );

    if (!force && matchedTemplates.length > 0) {
      throw new ConflictError(
        'Template with name already exists, include "&force=true" query to continue'
      );
    }

    const id = randomUUID();

    await this.db.save(`${db_source}/${id}`, dto);

    return id;
  }

  async getAll() {
    return await this.db.get(db_source);
  }

  async getById(id: string) {
    return await this.db.getById(db_source, id);
  }

  async delete(id: string) {
    return await this.db.delete(`${db_source}/${id}`);
  }

  async parseTemplate(templateId: string, input: Record<string, string>) {
    const inputConfig = Object.assign({ items: [] }, input);
    const templateConfig = await this.getById(templateId).catch(
      () => undefined
    );

    if (!templateConfig) {
      throw TemplateNotFoundError;
    }

    const templateParts = [
      ...templateConfig.template.matchAll(interpolationRegex)
    ];

    let output = `${templateConfig.template}`;
    let unlabeledPos = 0;

    templateParts.forEach(([part]) => {
      const labelResult = labelRegex.exec(part);
      labelRegex.lastIndex = 0;
      let label = `items.${unlabeledPos}`;
      if (labelResult && labelResult[1]) {
        label = labelResult[1];
      } else {
        unlabeledPos++;
      }

      const value = get(inputConfig, label, '---');

      output = output.replace(part, value);
    });

    return output;
  }
}

Container.provide([
  { provide: new InjectionToken('TemplateDAO'), useClass: TemplateDAO }
]);

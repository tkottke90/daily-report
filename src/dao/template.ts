import { Container, Injectable, InjectionToken } from '@decorators/di';
import { randomUUID } from 'node:crypto';
import { TemplateDTO } from '../dto';
import { NotFoundError } from '../utilities';
import { get } from 'lodash';

const tempMap = new Map<string, TemplateDTO>();

const interpolationRegex = /\$\{[\w\d]*\}/gm;
const labelRegex = /\$\{([\w\d]*)\}/gm;

const TemplateNotFoundError = new NotFoundError('Template With ID Not Found');

@Injectable()
export class TemplateDAO {
  create(dto: TemplateDTO) {
    const id = randomUUID();

    tempMap.set(id, dto);

    return id;
  }

  getAll() {
    return Array.from(tempMap);
  }

  getById(id: string) {
    return tempMap.get(id);
  }

  delete(id: string) {
    if (!tempMap.has(id)) {
      throw TemplateNotFoundError;
    }
  }

  parseTemplate(templateId: string, input: Record<string, string>) {
    const inputConfig = Object.assign({ items: [] }, input);
    const templateConfig = tempMap.get(templateId);

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

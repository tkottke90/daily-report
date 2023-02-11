import Joi from 'joi';
import { TemplateDTO } from '../dto';

export const create = Joi.object<TemplateDTO>({
  name: Joi.string().required(),
  template: Joi.string().required()
});

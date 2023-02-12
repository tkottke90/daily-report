import Joi from 'joi';

export * as TemplateValidation from './template';
export * as TemplateDataValidation from './template-data';

export const IdValidation = Joi.string().required();

import Joi from 'joi';

export * as TemplateValidation from './template';

export const IdValidation = Joi.string().required();

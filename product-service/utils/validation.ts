import * as Joi from 'joi';

export const createValidatorFunction = <T>(schema: Joi.Schema) => (data: T) =>
  schema.validateAsync(data, { abortEarly: false, allowUnknown: false})

import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  API_PORT: Joi.number().required(),

  ENVIRONMENT: Joi.string().required(),

  URL_AUTORIZADA_CORS: Joi.string().required(),

  JWT_SECRET: Joi.string().required(),

});

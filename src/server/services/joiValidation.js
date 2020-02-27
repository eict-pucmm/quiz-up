import Joi from '@hapi/joi';

export default function () {
  Joi.objectId = require('joi-objectid')(Joi);
}

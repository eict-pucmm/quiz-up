import moongose from 'mongoose';
import Joi from '@hapi/joi';

const Schema = moongose.Schema;

const Admin = new Schema({
  firebaseUID: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  allAccess: {
    type: Boolean,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export function validateAdmin(admin) {
  const schema = Joi.object({
    firebaseUID: Joi.string().max(255).required(),
    firstName: Joi.string().max(255).required(),
    lastName: Joi.string().max(255).required(),
    allAccess: Joi.boolean().required(),
  }).options({ stripUnknown: true });

  return schema.validate(admin);
}

export function validateForUpdate(admin) {
  const schema = Joi.object({
    firstName: Joi.string().max(255).required(),
    lastName: Joi.string().max(255).required(),
    allAccess: Joi.boolean().required(),
    deleted: Joi.boolean(),
    deletedAt: Joi.date(),
  }).options({ stripUnknown: true });

  return schema.validate(admin);
}

export default moongose.model('Admin', Admin);

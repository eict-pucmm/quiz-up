import moongose from 'mongoose';
import Joi from '@hapi/joi';

const Schema = moongose.Schema;

const Resident = new Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
  },
  grade: {
    type: String,
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  //Residents shouldn't be removed,  so the
  //model doesn't need a `deleted` property
});

export function validateResident(resident) {
  const schema = Joi.object({
    firstName: Joi.string().max(255).required(),
    lastName: Joi.string().max(255).required(),
    team: Joi.objectId(),
    grade: Joi.string(),
    createdBy: Joi.objectId(),
  }).options({ stripUnknown: true });

  return schema.validate(resident);
}

export function validateForUpdate(resident) {
  const schema = Joi.object({
    firstName: Joi.string().max(255).required(),
    lastName: Joi.string().max(255).required(),
    team: Joi.objectId(),
    grade: Joi.string(),
  }).options({ stripUnknown: true });

  return schema.validate(resident);
}

export default moongose.model('Resident', Resident);

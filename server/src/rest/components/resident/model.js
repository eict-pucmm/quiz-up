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
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export function validateResident(resident) {
  const schema = Joi.object({
    firstName: Joi.string().max(255).required(),
    lastName: Joi.string().max(255).required(),
    team: Joi.objectId(),
    grade: Joi.string(),
  }).options({ stripUnknown: true });

  return schema.validate(resident);
}

export default moongose.model('Resident', Resident);

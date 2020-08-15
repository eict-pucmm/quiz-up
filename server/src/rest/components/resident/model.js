import moongose from 'mongoose';
import Joi, { number } from '@hapi/joi';

const Schema = moongose.Schema;

const Resident = new Schema({
  fullName: {
    type: String,
    required: true,
    minlength: 4,
  },
  team: {
    type: Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  grade: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

/**
 * Validate the data sent to create a resident.
 * @param {Object} resident
 * @returns {Promise} Promise-like object that
 * can be used as a promise, or as a simple object.
 *
 * To learn more you can head to:
 * https://github.com/hapijs/joi/blob/v13.1.2/API.md#validatevalue-schema-options-callback
 */
export function validateResident(resident) {
  const schema = Joi.object({
    fullName: Joi.string().min(4).max(255).required(),
    team: Joi.objectId(),
    grade: Joi.number(),
  }).options({ stripUnknown: true });

  return schema.validate(resident);
}

export default moongose.model('Resident', Resident);

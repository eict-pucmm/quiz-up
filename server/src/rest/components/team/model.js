import moongose from 'mongoose';
import Joi from '@hapi/joi';

const Schema = moongose.Schema;

const Team = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255,
    unique: true,
  },
  residents: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Residents',
    },
  ],
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

/**
 * Validate the data sent to create a team.
 * @param {Object} team
 * @returns {Promise} Promise-like object that
 * can be used as a promise, or as a simple object.
 *
 * To learn more you can head to:
 * https://github.com/hapijs/joi/blob/v13.1.2/API.md#validatevalue-schema-options-callback
 */
export function validateTeam(team) {
  const schema = Joi.object({
    name: Joi.string().min(4).max(255).required(),
    residents: Joi.array().items(Joi.objectId()).required(),
  }).options({ stripUnknown: true });

  return schema.validate(team);
}

export default moongose.model('Team', Team);

import moongose from 'mongoose';
import Joi from '@hapi/joi';

const Schema = moongose.Schema;

const Competitor = new Schema({
  fullName: {
    type: String,
    required: true,
    minlength: 4,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

/**
 * Validate the data sent to create a competitor.
 * @param {Object} competitor
 * @returns {Promise} Promise-like object that
 * can be used as a promise, or as a simple object.
 *
 * To learn more you can head to:
 * https://github.com/hapijs/joi/blob/v13.1.2/API.md#validatevalue-schema-options-callback
 */
export function validateCompetitor(competitor) {
  const schema = Joi.object({
    fullName: Joi.string().min(4).max(255).required(),
  }).options({ stripUnknown: true });

  return schema.validate(competitor);
}

export default moongose.model('Competitor', Competitor);

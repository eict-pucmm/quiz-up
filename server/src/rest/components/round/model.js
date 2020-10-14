import moongose from 'mongoose';
import Joi from '@hapi/joi';

const Schema = moongose.Schema;

const Round = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255,
  },
  finished: {
    type: Boolean,
    required: true,
    default: false,
  },
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Question',
    },
  ],
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
  ],
  participants: [
    {
      type: new Schema({
        team: {
          type: Schema.Types.ObjectId,
          ref: 'Team',
        },
        answered: [
          {
            type: Schema.Types.ObjectId,
            ref: 'Question',
          },
        ],
      }),
    },
  ],
});

/**
 * Validate the data sent to create a round.
 * @param {Object} round
 * @returns {Promise} Promise-like object that
 * can be used as a promise, or as a simple object.
 *
 * To learn more you can head to:
 * https://github.com/hapijs/joi/blob/v13.1.2/API.md#validatevalue-schema-options-callback
 */
export function validateRound(round) {
  const schema = Joi.object({
    name: Joi.string().min(4).max(255).required(),
    event: Joi.string().required(),
    questions: Joi.array(),
    categories: Joi.array(),
    participants: Joi.array(),
    roomId: Joi.string().required(),
    finished: Joi.boolean(),
  }).options({ stripUnknown: true });

  return schema.validate(round);
}

export default moongose.model('Round', Round);

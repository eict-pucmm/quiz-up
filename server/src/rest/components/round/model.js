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
  event: {
    type: new Schema({
      name: {
        type: String,
        required: true,
      },
    }),
    required: true,
  },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Question',
    },
  ],
  roomId: {
    type: String,
    required: true,
  },
  results: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Results',
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
    name: Joi.string()
      .min(4)
      .max(255)
      .required(),
    event: Joi.string().required(),
    questions: Joi.array()
      .items(Joi.objectId())
      .required(),
    roomId: Joi.string().regex(/^[0-9]{3,6}$/),
    results: Joi.array().items(Joi.objectId()),
  }).options({ stripUnknown: true });

  return schema.validate(round);
}

export default moongose.model('Round', Round);

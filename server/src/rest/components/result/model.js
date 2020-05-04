import moongose from 'mongoose';
import Joi from '@hapi/joi';

const Schema = moongose.Schema;

const Result = new Schema({
  team: {
    type: new Schema({
      name: {
        type: String,
        minlength: 4,
        maxlength: 255,
      },
    }),
    required: true,
  },
  questionsAnswered: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Question',
    },
  ],
});

/**
 * Validate the data sent to create a result.
 * @param {Object} result
 * @returns {Promise} Promise-like object that
 * can be used as a promise, or as a simple object.
 *
 * To learn more you can head to:
 * https://github.com/hapijs/joi/blob/v13.1.2/API.md#validatevalue-schema-options-callback
 */
export function validateResult(result) {
  const schema = Joi.object({
    name: Joi.string().min(4).max(255).required(),
    dateOfEvent: Joi.date().required(),
    questionsAnswered: Joi.array().items(Joi.objectId()),
  }).options({ stripUnknown: true });

  return schema.validate(result);
}

export default moongose.model('Result', Result);

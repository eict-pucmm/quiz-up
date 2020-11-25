import moongose from 'mongoose';
import Joi from '@hapi/joi';

const Schema = moongose.Schema;

const Round = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
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
      type: new Schema({
        categorySelected: {
          type: String,
        },
        question: {
          type: Schema.Types.ObjectId,
          ref: 'Question',
        },
        timer: {
          type: Number,
          default: 15,
        },
        disabled: {
          type: Boolean,
          default: false,
        },
        answers: [
          {
            team: {
              type: String,
            },
            timeToAnswer: {
              type: Number,
            },
          },
        ],
      }),
    },
  ],
  categories: [
    {
      type: String,
      required: true,
    },
  ],
  participants: [
    {
      type: new Schema({
        team: {
          type: Schema.Types.ObjectId,
          ref: 'Team',
        },
        connected: {
          type: Boolean,
          default: false,
        },
        answered: [
          {
            type: Schema.Types.ObjectId,
            ref: 'Question',
          },
        ],
        failed: [
          {
            type: Schema.Types.ObjectId,
            ref: 'Question',
          },
        ],
      }),
    },
  ],
  deleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Admin',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
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
    name: Joi.string().min(3).max(255).required(),
    event: Joi.string().required(),
    questions: Joi.array(),
    categories: Joi.array(),
    participants: Joi.array(),
    roomId: Joi.string().required(),
    finished: Joi.boolean(),
    createdBy: Joi.objectId(),
  }).options({ stripUnknown: true });

  return schema.validate(round);
}

export function validateForUpdate(round) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(255),
    event: Joi.string(),
    questions: Joi.array(),
    categories: Joi.array(),
    participants: Joi.array(),
    finished: Joi.boolean(),
    deleted: Joi.boolean(),
    deletedAt: Joi.date(),
  }).options({ stripUnknown: true });

  return schema.validate(round);
}

export default moongose.model('Round', Round);

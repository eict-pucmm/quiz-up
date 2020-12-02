import moongose from 'mongoose';
import Joi from '@hapi/joi';

const Schema = moongose.Schema;

const Question = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255,
  },
  categories: [
    {
      type: String,
      required: true,
    },
  ],
  points: {
    type: Number,
    required: true,
    min: 100,
    max: 500,
    default: 100,
  },
  isBonus: {
    type: Boolean,
    default: false,
  },
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
    required: true,
    default: Date.now,
  },
});

/**
 * Validate the data sent to create a question.
 * @param {Object} question
 * @returns {Promise} Promise-like object that
 * can be used as a promise, or as a simple object.
 *
 * To learn more you can head to:
 * https://github.com/hapijs/joi/blob/v13.1.2/API.md#validatevalue-schema-options-callback
 */
export function validateQuestion(question) {
  const schema = Joi.object({
    name: Joi.string().min(4).max(255).required(),
    categories: Joi.array(),
    points: Joi.number().min(100).max(500).required(),
    isBonus: Joi.boolean(),
    deleted: Joi.boolean(),
    createdBy: Joi.objectId(),
  }).options({ stripUnknown: true });

  return schema.validate(question);
}

export function validateForUpdate(question) {
  const schema = Joi.object({
    name: Joi.string().min(4).max(255),
    categories: Joi.array(),
    points: Joi.number().min(100).max(500),
    deleted: Joi.boolean(),
    deletedAt: Joi.date(),
  }).options({ stripUnknown: true });

  return schema.validate(question);
}

export default moongose.model('Question', Question);

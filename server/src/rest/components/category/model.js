import moongose from 'mongoose';
import Joi from '@hapi/joi';

const Schema = moongose.Schema;

const Category = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 255,
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
 * Validate the data sent to create a category.
 * @param {Object} category
 * @returns {Promise} Promise-like object that
 * can be used as a promise, or as a simple object.
 *
 * To learn more you can head to:
 * https://github.com/hapijs/joi/blob/v13.1.2/API.md#validatevalue-schema-options-callback
 */
export function validateCategory(category) {
  const schema = Joi.object({
    name: Joi.string().max(255).required(),
    deleted: Joi.boolean(),
    createdBy: Joi.objectId(),
  }).options({ stripUnknown: true });

  return schema.validate(category);
}

export function validateForUpdate(category) {
  const schema = Joi.object({
    name: Joi.string().max(255),
    deleted: Joi.boolean(),
    deletedAt: Joi.date(),
  }).options({ stripUnknown: true });

  return schema.validate(category);
}

export default moongose.model('Category', Category);

import moongose from 'mongoose';
import Joi from '@hapi/joi';

const Schema = moongose.Schema;

const Category = new Schema({
  category: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255,
    unique: true,
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
    category: Joi.string()
      .min(4)
      .max(255)
      .required(),
  }).options({ stripUnknown: true });

  return schema.validate(category);
}

export default moongose.model('Category', Category);

import moongose from 'mongoose';
import Joi from '@hapi/joi';

const Schema = moongose.Schema;

const MedicalCenter = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255,
    unique: true,
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
 * Validate the data sent to create a medical center.
 * @param {Object} MedicalCenter
 * @returns {Promise} Promise-like object that
 * can be used as a promise, or as a simple object.
 *
 * To learn more you can head to:
 * https://github.com/hapijs/joi/blob/v13.1.2/API.md#validatevalue-schema-options-callback
 */
export function validateMedicalCenter(medicalCenter) {
  const schema = Joi.object({
    name: Joi.string().min(4).max(255).required(),
    createdBy: Joi.objectId(),
  }).options({ stripUnknown: true });

  return schema.validate(medicalCenter);
}

export default moongose.model('MedicalCenter', MedicalCenter);

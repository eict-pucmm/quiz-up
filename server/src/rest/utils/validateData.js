import { BAD_REQUEST, DUPLICATE } from '../../config/statusCodes';

/**
 * Validates the body of the request following a Model Schema and also checks
 * if the new entry is unique.
 * @param {Object} body contains the raw body of the request.
 * @param {Object} attributes contains the information of the attributes
 * needed to look for a duplicate entry in the database.
 * @return {Array} first value is an error object, the second one is the
 * validated body of the request.
 */
export default async function(body, attributes) {
  const { Model, field, validate } = attributes;
  const { value, error } = validate(body);

  if (error) {
    return [{ status: BAD_REQUEST, message: error.details[0].message }, null];
  }

  const exists = await Model.findOne({ [field]: value[field] });
  if (exists) {
    return [
      { status: DUPLICATE, message: `This ${field} already exist` },
      null,
    ];
  }

  return [null, value];
}

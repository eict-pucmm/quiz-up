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
  const { Model, fields, validate } = attributes;
  const { value, error } = validate(body);

  if (error) {
    return [{ status: BAD_REQUEST, message: error.details[0].message }, null];
  }

  if (Model && fields) {
    //make dynamic queries to findOne
    let query = {};
    fields.split(',').map(i => (query = { ...query, [i]: value[i] }));

    const exists = await Model.findOne(query);
    if (exists) {
      return [
        { status: DUPLICATE, message: `This ${fields} already exist` },
        null,
      ];
    }
  }

  return [null, value];
}

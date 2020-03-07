import { BAD_REQUEST, DUPLICATE } from '../../config/statusCodes';

export default async function (body, attributes) {
  const { Model, field, validate } = attributes;
  const { value, error } = validate(body);

  if (error) {
    return [{ status: BAD_REQUEST, message: error.details[0].message }, null];
  }

  const exists = await Model.findOne({ [field]: value[field] });
  if (exists) {
    return [{ status: DUPLICATE, message: `This ${field} already exist` }, null];
  }

  return [null, value];
}

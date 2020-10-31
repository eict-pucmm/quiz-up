import Admin, { validateAdmin, validateForUpdate } from './model';
import {
  OK,
  INTERNAL_SERVER_ERROR,
  CREATED,
} from '../../../config/statusCodes';
import wrapper from '../../utils/async';
import validateData from '../../utils/validateData';

const attributes = {
  Model: Admin,
  fields: 'firebaseUID',
  validate: validateAdmin,
};

/**
 * List of Admin
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of Admin
 */
const list = async (req, res) => {
  const [error, admins] = await wrapper(Admin.find({ deleted: false }));

  return error
    ? res.status(INTERNAL_SERVER_ERROR).json({ error })
    : res.status(OK).json({ admins });
};

/**
 * Finds one specific Admin
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of a Admin
 */
const findById = async (req, res) => {
  const [error, admin] = await wrapper(Admin.findById({ _id: req.params.id }));

  return error
    ? res.status(INTERNAL_SERVER_ERROR).json({ error })
    : res.status(OK).json({ admin });
};

/**
 * Creates a Admin
 * @param {Object} req
 * @param {Object} res
 * @returns The saved admin
 */
const create = async (req, res) => {
  const [error, value] = await validateData(req.body, attributes);

  if (error) {
    return res.status(error.status).send(error.message);
  }

  const admin = new Admin(value);
  const [errorSaving, savedCategory] = await wrapper(admin.save());

  return errorSaving
    ? res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: 'Error creating the admin', error: errorSaving })
    : res.status(CREATED).send(savedCategory);
};

/**
 * Updates a Admin
 * @param {Object} req
 * @param {Object} res
 * @returns The admin updated
 */
const update = async (req, res) => {
  const [error, value] = await validateData(req.body, {
    ...attributes,
    validate: validateForUpdate,
  });

  if (error) {
    return res.status(error.status).send(error.message);
  }

  const [errorUpdating, updatedCategory] = await wrapper(
    Admin.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: value },
      { new: true }
    )
  );

  return errorUpdating
    ? res.status(INTERNAL_SERVER_ERROR).send('Error updating the admin')
    : res.status(CREATED).send(updatedCategory);
};

export { list, findById, create, update };

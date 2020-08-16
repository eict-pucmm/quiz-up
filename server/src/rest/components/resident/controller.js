import Resident, { validateResident } from './model';

import {
  OK,
  INTERNAL_SERVER_ERROR,
  CREATED,
} from '../../../config/statusCodes';
import wrapper from '../../utils/async';

/**
 * List of Residents
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of Residents
 */
const list = async (req, res) => {
  const [error, residents] = await wrapper(Resident.find());
  return error
    ? res.status(INTERNAL_SERVER_ERROR).json({ error })
    : res.status(OK).json({ residents });
};

/**
 * Finds one specific Resident
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of a Resident
 */
const findById = async (req, res) => {
  const [error, resident] = await wrapper(
    Resident.findById({ _id: req.params.id })
  );

  return error
    ? res.status(INTERNAL_SERVER_ERROR).json({ error })
    : res.status(OK).json({ resident });
};

/**
 * Creates a Resident
 * @param {Object} req
 * @param {Object} res
 * @returns The saved Resident
 */
const create = async (req, res) => {
  const { error, value } = await validateResident(req.body);

  if (error) {
    return res.status(error.status).send(error.message);
  }

  const resident = new Resident(value);
  const [errorSaving, savedResident] = await wrapper(resident.save());

  return errorSaving
    ? res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: 'Error creating the resident', error: errorSaving })
    : res.status(CREATED).send(savedResident);
};

/**
 * Updates a Resident
 * @param {Object} req
 * @param {Object} res
 * @returns The Resident updated
 */
const update = async (req, res) => {
  const { error, value } = await validateResident(req.body);

  if (error) {
    return res.status(error.status).send(error.message);
  }

  const [errorUpdating, updatedResident] = await wrapper(
    Resident.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: value },
      { new: true }
    )
  );

  return errorUpdating
    ? res.status(INTERNAL_SERVER_ERROR).send('Error updating the resident')
    : res.status(OK).send(updatedResident);
};

export { list, findById, create, update };

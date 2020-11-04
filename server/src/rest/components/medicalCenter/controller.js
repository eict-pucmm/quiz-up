import MedicalCenter, { validateMedicalCenter } from './model';

import {
  OK,
  INTERNAL_SERVER_ERROR,
  CREATED,
} from '../../../config/statusCodes';
import wrapper from '../../utils/async';
import validateData from '../../utils/validateData';

const attributes = {
  Model: MedicalCenter,
  fields: 'name',
  validate: validateMedicalCenter,
};

/**
 * List of MedicalCenter
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of MedicalCenter
 */
const list = async (req, res) => {
  const [error, medicalCenters] = await wrapper(
    MedicalCenter.find().populate([
      { path: 'createdBy', select: 'firstName lastName -_id' },
    ])
  );
  return error
    ? res.status(INTERNAL_SERVER_ERROR).json({ error })
    : res.status(OK).json({ medicalCenters });
};

/**
 * Finds one specific MedicalCenter
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of a MedicalCenter
 */
const findById = async (req, res) => {
  const [error, medicalCenter] = await wrapper(
    MedicalCenter.findById({ _id: req.params.id })
  );

  return error
    ? res.status(INTERNAL_SERVER_ERROR).json({ error })
    : res.status(OK).json({ medicalCenter });
};

/**
 * Creates a MedicalCenter
 * @param {Object} req
 * @param {Object} res
 * @returns The saved medical center
 */
const create = async (req, res) => {
  const [error, value] = await validateData(req.body, attributes);

  if (error) {
    return res.status(error.status).send(error.message);
  }

  const medicalCenter = new MedicalCenter(value);
  const [errorSaving, savedMC] = await wrapper(medicalCenter.save());

  return errorSaving
    ? res.status(INTERNAL_SERVER_ERROR).json({
        message: 'Error creating the medical center',
        error: errorSaving,
      })
    : res.status(CREATED).json({ medicalCenter: savedMC });
};

/**
 * Updates a Medical center
 * @param {Object} req
 * @param {Object} res
 * @returns The medical center updated
 */
const update = async (req, res) => {
  const [error, value] = await validateData(req.body, attributes);

  if (error) {
    return res.status(error.status).send(error.message);
  }

  const [errorUpdating, updatedMC] = await wrapper(
    MedicalCenter.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: value },
      { new: true }
    )
  );

  return errorUpdating
    ? res
        .status(INTERNAL_SERVER_ERROR)
        .send('Error updating the medical center')
    : res.status(CREATED).json({ medicalCenter: updatedMC });
};

export { list, findById, create, update };

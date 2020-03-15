import Round, { validateRound } from './model';

import {
  OK,
  INTERNAL_SERVER_ERROR,
  CREATED,
} from '../../../config/statusCodes';
import wrapper from '../../utils/async';
import validateData from '../../utils/validateData';

const attributes = {
  Model: Round,
  field: 'roomId',
  validate: validateRound,
};

/**
 * List of Round
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of Round
 */
const list = async (req, res) => {
  const [error, rounds] = await wrapper(Round.find());
  return error
    ? res.status(INTERNAL_SERVER_ERROR).json({ error })
    : res.status(OK).json({ rounds });
};

/**
 * Finds one specific Round
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of a Round
 */
const findById = async (req, res) => {
  const [error, round] = await wrapper(Round.findById({ _id: req.params.id }));

  return error
    ? res.status(INTERNAL_SERVER_ERROR).json({ error })
    : res.status(OK).json({ round });
};

/**
 * Creates a Round
 * @param {Object} req
 * @param {Object} res
 * @returns The saved Round
 */
const create = async (req, res) => {
  const [error, value] = await validateData(req.body, attributes);

  if (error) {
    return res.status(error.status).send(error.message);
  }

  const Round = new Round(value);
  const [errorSaving, savedRound] = await wrapper(Round.save());

  return errorSaving
    ? res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: 'Error creating the Round', error: errorSaving })
    : res.status(CREATED).send(savedRound);
};

/**
 * Updates a Round
 * @param {Object} req
 * @param {Object} res
 * @returns The Round updated
 */
const update = async (req, res) => {
  const [error, value] = await validateData(req.body, attributes);

  if (error) {
    return res.status(error.status).send(error.message);
  }

  const [errorUpdating, updatedRound] = await wrapper(
    Round.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: value },
      { new: true },
    ),
  );

  return errorUpdating
    ? res.status(INTERNAL_SERVER_ERROR).send('Error updating the Round')
    : res.status(CREATED).send(updatedRound);
};

export { list, findById, create, update };

import Round, { validateRound } from './model';

import {
  OK,
  INTERNAL_SERVER_ERROR,
  CREATED,
  BAD_REQUEST,
} from '../../../config/statusCodes';
import wrapper from '../../utils/async';
import validateData from '../../utils/validateData';

const attributes = {
  Model: Round,
  fields: 'name,event',
  validate: validateRound,
};

/**
 * List of Rounds
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of Rounds
 */
const list = async (req, res) => {
  const [error, rounds] = await wrapper(
    Round.find().populate('event', 'name dateOfEvent')
  );
  return error
    ? res.status(INTERNAL_SERVER_ERROR).json({ error })
    : res.status(OK).json({ rounds });
};

/**
 * List of Rounds that belong to an event
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of Rounds
 */
const roundByEvent = async (req, res) => {
  const [error, rounds] = await wrapper(
    Round.find({ event: req.params.idOfEvent })
  );

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
  const [error, round] = await wrapper(
    Round.findById({ _id: req.params.id }).populate([
      {
        path: 'questions',
        select: 'name points category.name',
      },
      {
        path: 'participants',
        select: 'name',
      },
    ])
  );

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

  const round = new Round(value);
  const [errorSaving, savedRound] = await wrapper(round.save());

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
  const { error, value } = await validateRound(req.body);

  if (error) {
    return res.status(BAD_REQUEST).send(error.details[0].message);
  }

  const [errorUpdating, updatedRound] = await wrapper(
    Round.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: value },
      { new: true }
    )
  );

  return errorUpdating
    ? res.status(INTERNAL_SERVER_ERROR).send('Error updating the Round')
    : res.status(OK).send(updatedRound);
};

export { list, findById, create, update, roundByEvent };

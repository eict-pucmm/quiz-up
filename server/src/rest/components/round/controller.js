import Round, { validateRound, validateForUpdate } from './model';

import {
  OK,
  INTERNAL_SERVER_ERROR,
  CREATED,
} from '../../../config/statusCodes';
import wrapper from '../../utils/async';
import validateData from '../../utils/validateData';

const attributes = {
  Model: Round,
  fields: 'name,event',
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
        path: 'questions.question',
        select: 'name points',
      },
      {
        path: 'participants.team',
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
  try {
    let roomId = String(Math.floor(100000 + Math.random() * 900000));
    let roundExists = await Round.findOne({ roomId });

    while (roundExists) {
      roomId = String(Math.floor(100000 + Math.random() * 900000));
      roundExists = await Round.findOne({ roomId });
    }

    const [error, value] = await validateData(
      {
        ...req.body,
        roomId,
        questions: req.body.questionBank.map(({ categorySelected, _id }) => ({
          categorySelected,
          question: _id,
        })),
      },
      { ...attributes, validate: validateRound }
    );

    if (error) {
      return res.status(error.status).send(error.message);
    }

    const round = new Round(value);
    await round.save();

    return res.status(CREATED).send(round);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Error creating the Round', error });
  }
};

/**
 * Updates a Round
 * @param {Object} req
 * @param {Object} res
 * @returns The Round updated
 */
const update = async (req, res) => {
  const [error, value] = await validateData(req.body, {
    ...attributes,
    validate: validateForUpdate,
  });

  if (error) {
    return res.status(error.status).send(error.message);
  }

  const [errorUpdating, updatedRound] = await wrapper(
    Round.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: value },
      { new: true }
    )
  );

  return errorUpdating
    ? res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: 'Error updating the round', errorUpdating })
    : res.status(OK).send(updatedRound);
};

export { list, findById, create, update, roundByEvent };

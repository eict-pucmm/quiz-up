import Round, { validateRound, validateForUpdate } from './model';

import {
  OK,
  INTERNAL_SERVER_ERROR,
  CREATED,
} from '../../../config/statusCodes';
import wrapper from '../../utils/async';
import validateData from '../../utils/validateData';
import io from '../../../services/socket';

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
  const finished = req.query.finished == 1;
  const [error, rounds] = await wrapper(
    Round.find({ event: req.params.idOfEvent, finished: finished }).populate([
      {
        path: 'bonusQuestion',
        select: 'name',
      },
      {
        path: 'questions.question',
        select: 'name categories points',
      },
    ])
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
        path: 'participants.failed',
        select: 'points',
      },
      {
        path: 'participants.answered',
        select: 'points',
      },
      {
        path: 'participants.team',
        select: 'name',
      },
      {
        path: 'bonusQuestion',
        select: 'name',
      },
    ])
  );

  const withTotalPoints = round.participants.map(values => {
    const { answered, failed, connected, _id, team, answeredBonus } = values;
    const temp = { connected, _id, team, answered, failed, answeredBonus };
    const sumFunc = (total, num) => total + num.points;
    const pointsGained = answered.reduce(sumFunc, 0);
    const pointsLosed = failed.reduce(sumFunc, 0);
    let bonusPoints = 0;

    if (answeredBonus.joined) {
      if (answeredBonus.failed == null) {
        return;
      }
      bonusPoints = answeredBonus.failed
        ? -answeredBonus.points
        : answeredBonus.points;
    }

    return { ...temp, total: pointsGained - pointsLosed + bonusPoints };
  });

  return error
    ? res.status(INTERNAL_SERVER_ERROR).json({ error })
    : res.status(OK).json({
        round: {
          name: round.name,
          finished: round.finished,
          roomId: round.roomId,
          event: round.event,
          questions: round.questions,
          categories: round.categories,
          participants: withTotalPoints,
          bonusQuestion: round.bonusQuestion,
        },
      });
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
  if (req.body.participants) {
    req.body.participants = req.body.participants.map(
      ({ answered = [], failed = [], ...others }) => {
        if (answered && answered.length > 0) {
          answered = answered.map(ans => (ans._id ? ans._id : ans));
        }
        if (failed && failed.length > 0) {
          failed = failed.map(fail => (fail._id ? fail._id : fail));
        }
        return { answered, failed, ...others };
      }
    );
  }

  const body = !req.body.questionBank
    ? { ...req.body }
    : {
        ...req.body,
        questions: req.body.questionBank.map(({ categorySelected, _id }) => ({
          categorySelected,
          question: _id,
        })),
      };

  const [error, value] = await validateData(body, {
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

  if (errorUpdating) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Error updating the round', errorUpdating });
  }

  const [errorGetting, round] = await wrapper(
    Round.findById({ _id: req.params.id }).populate([
      {
        path: 'questions.question',
        select: 'name points',
      },
      {
        path: 'participants.failed',
        select: 'points',
      },
      {
        path: 'participants.answered',
        select: 'points',
      },
      {
        path: 'participants.team',
        select: 'name',
      },
      {
        path: 'bonusQuestion',
        select: 'name',
      },
    ])
  );

  const withTotalPoints = round.participants.map(values => {
    const { answered, failed, connected, _id, team, answeredBonus } = values;
    const temp = { connected, _id, team, answered, failed, answeredBonus };
    const sumFunc = (total, num) => total + num.points;
    const pointsGained = answered.reduce(sumFunc, 0);
    const pointsLosed = failed.reduce(sumFunc, 0);
    let bonusPoints = 0;

    if (answeredBonus.joined) {
      if (answeredBonus.failed == null) {
        return;
      }
      bonusPoints = answeredBonus.failed
        ? -answeredBonus.points
        : answeredBonus.points;
    }

    return { ...temp, total: pointsGained - pointsLosed + bonusPoints };
  });

  io.getIO().to(updatedRound.roomId).emit('teamsInfo', withTotalPoints);

  if (req.body.finished) {
    io.getIO().to(updatedRound.roomId).emit('roundFinished', round.finished);
  }

  return errorGetting
    ? res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: 'Error updating the round', errorGetting })
    : res.status(OK).send(round);
};

export { list, findById, create, update, roundByEvent };

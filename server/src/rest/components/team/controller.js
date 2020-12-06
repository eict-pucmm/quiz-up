import Team, { validateTeam, validateForUpdate } from './model';
import Round from '../round/model';
import {
  OK,
  INTERNAL_SERVER_ERROR,
  CREATED,
  NOT_FOUND,
  FORBIDDEN,
} from '../../../config/statusCodes';
import wrapper from '../../utils/async';
import validateData from '../../utils/validateData';

const attributes = {
  Model: Team,
  fields: 'name',
  validate: validateTeam,
};

const updateAttributes = {
  Model: Team,
  validate: validateForUpdate,
};

/**
 * List of Teams
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of Team
 */
const list = async (req, res) => {
  const [error, teams] = await wrapper(
    Team.find().populate([
      { path: 'createdBy', select: 'firstName lastName -_id' },
    ])
  );

  return error
    ? res.status(INTERNAL_SERVER_ERROR).json({ error })
    : res.status(OK).json({ teams });
};

/**
 * Finds one specific Team
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of a Team
 */
const findById = async (req, res) => {
  const [error, team] = await wrapper(Team.findOne({ _id: req.params.id }));
  return error
    ? res.status(INTERNAL_SERVER_ERROR).json({ error })
    : res.status(OK).json({ team });
};

/**
 * Finds all teams under a medical center
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of Teams
 */
const findByMedicalCenter = async (req, res) => {
  const [error, teams] = await wrapper(
    Team.find({ medicalCenter: req.query.center })
  );
  return error
    ? res.status(INTERNAL_SERVER_ERROR).json({ error })
    : res.status(OK).json({ teams });
};

/**
 * Finds the round info of a team
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of the team info of that specific round
 */
const findByRoomIdAndTeamName = async (req, res) => {
  const [errorRound, round] = await wrapper(
    Round.findOne({ roomId: req.params.room }).populate([
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
    ])
  );

  if (errorRound) {
    return res.stats(INTERNAL_SERVER_ERROR).json({ errorRound });
  }

  const withTotalPoints = round.participants.map(values => {
    const { answered, failed, connected, _id, team } = values;
    const temp = { connected, _id, team, answered, failed };
    const sumFunc = (total, num) => total + num.points;
    const pointsGained = answered.reduce(sumFunc, 0);
    const pointsLosed = failed.reduce(sumFunc, 0);

    return { ...temp, total: pointsGained - pointsLosed };
  });

  const teamInfo = withTotalPoints.find(
    ({ team }) => team.name === req.params.team
  );

  return res.status(OK).json({ teamInfo });
};

/**
 * Finds if team belongs to round
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of the team info of that specific round
 */
const findTeamBelongsToRound = async (req, res) => {
  const [errorRound, round] = await wrapper(
    Round.findOne({ roomId: req.params.room }).populate([
      {
        path: 'participants.team',
        select: 'name',
      },
    ])
  );

  if (round === null) {
    return res.status(NOT_FOUND).json({
      data: false,
      error: 'Favor introducir un número de ronda válido',
    });
  }

  if (errorRound) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ data: false, error: errorRound });
  }

  if (round.finished) {
    return res.status(FORBIDDEN).json({
      data: false,
      error: 'Esta ronda ya ha finalizado. Favor introducir otra ronda',
    });
  }

  const team = round.participants.find(el => el.team.name === req.params.team);

  return team
    ? res.status(OK).json({ data: true, error: null })
    : res
        .status(NOT_FOUND)
        .json({ data: false, error: 'El equipo no pertenece a la ronda.' });
};

/**
 * Creates a Team
 * @param {Object} req
 * @param {Object} res
 * @returns the Team created
 */
const create = async (req, res) => {
  const [error, value] = await validateData(req.body, attributes);

  if (error) {
    return res.status(error.status).send(error.message);
  }

  const team = new Team(value);
  const [errorSaving, savedTeam] = await wrapper(team.save());

  return errorSaving
    ? res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: 'Error saving the team', error: errorSaving })
    : res.status(CREATED).send(savedTeam);
};

/**
 * Updates a Team
 * @param {Object} req
 * @param {Object} res
 * @returns The team updated
 */
const update = async (req, res) => {
  const [error, value] = await validateData(req.body, updateAttributes);

  if (error) {
    return res.status(error.status).send(error.message);
  }

  const [errorUpdating, updatedTeam] = await wrapper(
    Team.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: value },
      { new: true }
    )
  );

  return errorUpdating
    ? res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: 'Error updating the team', error: errorUpdating })
    : res.status(CREATED).send(updatedTeam);
};

export {
  list,
  findById,
  create,
  findByMedicalCenter,
  update,
  findByRoomIdAndTeamName,
  findTeamBelongsToRound,
};

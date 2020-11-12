import Team, { validateTeam } from './model';
import {
  OK,
  INTERNAL_SERVER_ERROR,
  CREATED,
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
  validate: validateTeam,
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

export { list, findById, create, findByMedicalCenter, update };

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

/**
 * List of Teams
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of Team
 */
const list = async (req, res) => {
  const [error, teams] = await wrapper(
    Team.find()
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
  const [error, team] = await wrapper(
    Team.findOne({ _id: req.params.id }).populate('residents', 'fullName -_id')
  );
  return error
    ? res.status(INTERNAL_SERVER_ERROR).json({ error })
    : res.status(OK).json({ team });
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


const remove = async (req, res) => {
  const [errorRemoving, removedCategory] = await wrapper(
    Team.findByIdAndRemove({ _id: req.params.id })
  );

  return errorRemoving
    ? res.status(INTERNAL_SERVER_ERROR).send('Error removing the question')
    : res.status(NO_CONTENT);

}


export { list, findById, create , remove};

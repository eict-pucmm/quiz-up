import Competitor, { validateCompetitor } from './model';

import {
  OK,
  INTERNAL_SERVER_ERROR,
  CREATED,
} from '../../../config/statusCodes';
import wrapper from '../../utils/async';

/**
 * List of Competitor
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of Competitor
 */
const list = async (req, res) => {
  const [error, competitors] = await wrapper(Competitor.find());
  return error
    ? res.status(INTERNAL_SERVER_ERROR).json({ error })
    : res.status(OK).json({ competitors });
};

/**
 * Finds one specific Competitor
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of a Competitor
 */
const findById = async (req, res) => {
  const [error, competitor] = await wrapper(
    Competitor.findById({ _id: req.params.id }),
  );

  return error
    ? res.status(INTERNAL_SERVER_ERROR).json({ error })
    : res.status(OK).json({ competitor });
};

/**
 * Creates a Competitor
 * @param {Object} req
 * @param {Object} res
 * @returns The saved Competitor
 */
const create = async (req, res) => {
  const { error, value } = await validateCompetitor(req.body);

  if (error) {
    return res.status(error.status).send(error.message);
  }

  const competitor = new Competitor(value);
  const [errorSaving, savedCompetitor] = await wrapper(competitor.save());

  return errorSaving
    ? res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: 'Error creating the competitor', error: errorSaving })
    : res.status(CREATED).send(savedCompetitor);
};

/**
 * Updates a Competitor
 * @param {Object} req
 * @param {Object} res
 * @returns The Competitor updated
 */
const update = async (req, res) => {
  const { error, value } = await validateCompetitor(req.body);

  if (error) {
    return res.status(error.status).send(error.message);
  }

  const [errorUpdating, updatedCategory] = await wrapper(
    Competitor.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: value },
      { new: true },
    ),
  );

  return errorUpdating
    ? res.status(INTERNAL_SERVER_ERROR).send('Error updating the category')
    : res.status(OK).send(updatedCategory);
};

export { list, findById, create, update };

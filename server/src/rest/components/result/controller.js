import Result, { validateResult } from './model';

import {
  OK,
  INTERNAL_SERVER_ERROR,
  CREATED,
} from '../../../config/statusCodes';
import wrapper from '../../utils/async';

/**
 * List of Result
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of Result
 */
const list = async (req, res) => {
  const [error, results] = await wrapper(Result.find());
  return error
    ? res.status(INTERNAL_SERVER_ERROR).json({ error })
    : res.status(OK).json({ results });
};

/**
 * Finds one specific Result
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of a Result
 */
const findById = async (req, res) => {
  const [error, result] = await wrapper(
    Result.findById({ _id: req.params.id }),
  );

  return error
    ? res.status(INTERNAL_SERVER_ERROR).json({ error })
    : res.status(OK).json({ result });
};

/**
 * Creates a Result
 * @param {Object} req
 * @param {Object} res
 * @returns The saved Result
 */
const create = async (req, res) => {
  const { error, value } = await validateResult(req.body);

  if (error) {
    return res.status(error.status).send(error.message);
  }

  const result = new Result(value);
  const [errorSaving, savedResult] = await wrapper(result.save());

  return errorSaving
    ? res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: 'Error creating the result', error: errorSaving })
    : res.status(CREATED).send(savedResult);
};

/**
 * Updates a result
 * @param {Object} req
 * @param {Object} res
 * @returns The result updated
 */
const update = async (req, res) => {
  const { error, value } = await validateResult(req.body);

  if (error) {
    return res.status(error.status).send(error.message);
  }

  const [errorUpdating, updatedResult] = await wrapper(
    Result.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: value },
      { new: true },
    ),
  );

  return errorUpdating
    ? res.status(INTERNAL_SERVER_ERROR).send('Error updating the result')
    : res.status(CREATED).send(updatedResult);
};

export { list, findById, create, update };

import Category, { validateCategory } from './model';

import {
  OK,
  INTERNAL_SERVER_ERROR,
  CREATED,
} from '../../../config/statusCodes';
import wrapper from '../../utils/async';
import validateData from '../../utils/validateData';

const attributes = {
  Model: Category,
  fields: 'name',
  validate: validateCategory,
};

/**
 * List of Category
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of Category
 */
const list = async (req, res) => {
  const [error, categories] = await wrapper(Category.find());
  return error
    ? res.status(INTERNAL_SERVER_ERROR).json({ error })
    : res.status(OK).json({ categories });
};

/**
 * Finds one specific Category
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of a Category
 */
const findById = async (req, res) => {
  const [error, category] = await wrapper(
    Category.findById({ _id: req.params.id }),
  );

  return error
    ? res.status(INTERNAL_SERVER_ERROR).json({ error })
    : res.status(OK).json({ category });
};

/**
 * Creates a Category
 * @param {Object} req
 * @param {Object} res
 * @returns The saved category
 */
const create = async (req, res) => {
  const [error, value] = await validateData(req.body, attributes);

  if (error) {
    return res.status(error.status).send(error.message);
  }

  const category = new Category(value);
  const [errorSaving, savedCategory] = await wrapper(category.save());

  return errorSaving
    ? res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: 'Error creating the category', error: errorSaving })
    : res.status(CREATED).send(savedCategory);
};

/**
 * Updates a Category
 * @param {Object} req
 * @param {Object} res
 * @returns The category updated
 */
const update = async (req, res) => {
  const [error, value] = await validateData(req.body, attributes);

  if (error) {
    return res.status(error.status).send(error.message);
  }

  const [errorUpdating, updatedCategory] = await wrapper(
    Category.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: value },
      { new: true },
    ),
  );

  return errorUpdating
    ? res.status(INTERNAL_SERVER_ERROR).send('Error updating the category')
    : res.status(CREATED).send(updatedCategory);
};

export { list, findById, create, update };

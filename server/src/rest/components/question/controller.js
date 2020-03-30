import Question, { validateQuestion } from './model';
import Category from '../category/model';
import {
  OK,
  INTERNAL_SERVER_ERROR,
  CREATED,
  BAD_REQUEST,
} from '../../../config/statusCodes';
import wrapper from '../../utils/async';
import validateData from '../../utils/validateData';
import publishQuestion from '../../../services/publisher';
import subscribeToChannel from '../../../services/subscriber';

const attributes = {
  Model: Question,
  fields: 'name',
  validate: validateQuestion,
};

/**
 * List of Question
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of Question
 */
const list = async (req, res) => {
  const [error, questions] = await wrapper(Question.find());

  return error
    ? res.status(INTERNAL_SERVER_ERROR).json({ error })
    : res.status(OK).json({ questions });
};

/**
 * List of Question
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of Question
 */
const getRoundOfQuestions = async (req, res) => {
  const [error, questions] = await wrapper(
    Question.find({ 'category.name': req.body.category }),
  );

  return error
    ? res.status(INTERNAL_SERVER_ERROR).json({ error })
    : res.status(OK).json({ questions });
};

/**
 * Finds one specific Question
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of a Question
 */
const findById = async (req, res) => {
  const [error, question] = await wrapper(
    Question.findOne({ _id: req.params.id }),
  );
  return error
    ? res.status(INTERNAL_SERVER_ERROR).json({ error })
    : res.status(OK).json({ question });
};

/**
 * Creates a Question
 * @param {Object} req
 * @param {Object} res
 * @returns Message stating that a Question was created and a status of CREATED.
 */
const create = async (req, res) => {
  try {
    const [error, value] = await validateData(req.body, attributes);

    if (error) {
      return res.status(error.status).send(error.message);
    }

    const category = await Category.findOne({ name: value.category });
    if (!category) return res.status(BAD_REQUEST).send('Invalid category name');

    let question = new Question({
      name: value.name,
      category: {
        name: category.name,
      },
      points: value.points,
    });

    question = await question.save();

    return res.status(CREATED).send(question);
  } catch (error) {
    return res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: 'Error creating the question', error });
  }
};

/**
 * Publishes a Question
 * @param {Object} req
 * @param {Object} res
 * @returns Message stating that a Question was published and a status of OK.
 */
const publish = async (req, res) => {
  const sentAt = new Date();
  publishQuestion({ ...req.body, sentAt });

  return res.status(OK).send('question sent to subscribers');
};

const subscribe = async (req, res) => {
  subscribeToChannel(req.body.unsubscribe);
  return res.status(OK).send('its done');
};

export { list, findById, create, publish, subscribe };

import Question, { validateQuestion, validateForUpdate } from './model';
import {
    OK,
    INTERNAL_SERVER_ERROR,
    CREATED,
} from '../../../config/statusCodes';
import wrapper from '../../utils/async';
import validateData from '../../utils/validateData';
import publishQuestion from '../../../services/publisher';
import subscribeToChannel from '../../../services/subscriber';

const attributes = {
    Model: Question,
    fields: 'name',
};

/**
 * List of Questions
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of Question
 */
const list = async(req, res) => {
    const [error, questions] = await wrapper(
        Question.find({ deleted: false }).populate([
            { path: 'createdBy', select: 'firstName lastName -_id' },
        ])
    );

    return error ?
        res.status(INTERNAL_SERVER_ERROR).json({ error }) :
        res.status(OK).json({ questions });
};

/**
 * List of Bonus Questions
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of Question
 */
const listBonusQuestions = async(req, res) => {
    const [error, questions] = await wrapper(
        Question.find({ deleted: false, isBonus: true }).populate([
            { path: 'createdBy', select: 'firstName lastName -_id' },
        ])
    );

    return error ?
        res.status(INTERNAL_SERVER_ERROR).json({ error }) :
        res.status(OK).json({ questions });
};

/**
 * Finds question on specific category
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of Question
 */
const getQuestionByCategoryAndPoints = async(req, res) => {
    const { category, points } = req.params;

    const [error, questions] = await wrapper(
        Question.find({ categories: { $in: [category] }, points: points, deleted: false })
    );

    return error ?
        res.status(INTERNAL_SERVER_ERROR).json({ error }) :
        res.status(OK).json({ questions });
};

/**
 * Finds one specific Question
 * @param {Object} req
 * @param {Object} res
 * @returns {JSON} of a Question
 */
const findById = async(req, res) => {
    const [error, question] = await wrapper(
        Question.findOne({ _id: req.params.id })
    );
    return error ?
        res.status(INTERNAL_SERVER_ERROR).json({ error }) :
        res.status(OK).json({ question });
};

/**
 * Creates a Question
 * @param {Object} req
 * @param {Object} res
 * @returns Message stating that a Question was created and a status of CREATED.
 */
const create = async(req, res) => {
    try {
        const [error, value] = await validateData(req.body, {
            ...attributes,
            validate: validateQuestion,
        });

        if (error) {
            return res.status(error.status).send(error.message);
        }

        let question = new Question(value);

        question = await question.save();

        return res.status(CREATED).send(question);
    } catch (error) {
        return res
            .status(INTERNAL_SERVER_ERROR)
            .json({ message: 'Error creating the question', error });
    }
};

/**
 * Updates a question
 * @param {Object} req
 * @param {Object} res
 * @returns The question updated
 */
const update = async(req, res) => {
    const [error, value] = await validateData(req.body, {
        ...attributes,
        validate: validateForUpdate,
    });

    if (error) {
        return res.status(error.status).send(error.message);
    }

    const [errorUpdating, updatedQuestion] = await wrapper(
        Question.findByIdAndUpdate({ _id: req.params.id }, { $set: value }, { new: true })
    );

    return errorUpdating ?
        res
        .status(INTERNAL_SERVER_ERROR)
        .json({ message: 'Error updating the question', errorUpdating }) :
        res.status(CREATED).send(updatedQuestion);
};

/**
 * Publishes a Question
 * @param {Object} req
 * @param {Object} res
 * @returns Message stating that a Question was published and a status of OK.
 */
const publish = async(req, res) => {
    const sentAt = new Date();
    publishQuestion({...req.body, sentAt });

    return res.status(OK).send('question sent to subscribers');
};

/**
 * Subscribe to a queue
 * @param {Object} req
 * @param {Object} res
 * @returns Message stating it's subscribed.
 */
const subscribe = async(req, res) => {
    subscribeToChannel(req.body.unsubscribe);
    return res.status(OK).send('subscribed');
};

export {
    list,
    findById,
    create,
    publish,
    subscribe,
    update,
    getQuestionByCategoryAndPoints,
    listBonusQuestions,
};
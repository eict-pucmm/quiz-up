import express from 'express';
import {
  list,
  findById,
  create,
  publish,
  subscribe,
  update,
  getQuestionByCategoryAndPoints,
} from './controller';

const router = express.Router();

/**
 * @route GET '/'
 * @returns {JSON} of all questions
 * @access Public
 */
router.get('/', list);

/**
 * @route GET '/:id'
 * @returns {JSON} of a specific question
 * @access Public
 */
router.get('/:id', findById);

/**
 * @route GET '/category/:category/points/:points'
 * @returns {JSON} of a list of questions
 * that belong to a certain category and have
 * either 100 to 500 points
 * @access Public
 */
router.get(
  '/category/:category/points/:points',
  getQuestionByCategoryAndPoints
);

/**
 * @route POST '/'
 * @returns {JSON} of the question created
 * @access Private
 */
router.post('/', create);

/**
 * @route PUT '/:id'
 * @returns CREATED status code
 * @access Public
 */
router.put('/:id', update);

/**
 * @route GET 'mq/publish'
 * @returns Message stating that the question was send
 * @access Public
 */
router.post('/mq/publish', publish);

/**
 * @route GET '/mq/subscribe/'
 * @returns Message stating that the app it's subscribe
 * @access Public
 */
router.post('/mq/subscribe/', subscribe);

export default router;

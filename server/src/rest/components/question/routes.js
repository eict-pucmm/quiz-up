import express from 'express';
import {
  list,
  findById,
  create,
  publish,
  subscribe,
  update,
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

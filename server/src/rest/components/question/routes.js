import express from 'express';
import { list, findById, create, publish, subscribe } from './controller';

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
 * @returns message that says the operation was succesfull
 * @access Private
 */
router.post('/', create);

/**
 * @route GET '/publish'
 * @returns Message stating that the question was send
 * @access Public
 */
router.post('/publish', publish);

/**
 * @route GET '/publish'
 * @returns Message stating that the question was send
 * @access Public
 */
router.post('/mq/subscribe', subscribe);

export default router;

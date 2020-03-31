import express from 'express';
import { list, findById, create, update, roundByEvent } from './controller';

const router = express.Router();

/**
 * @route GET '/'
 * @returns {JSON} of all rounds
 * @access Public
 */
router.get('/', list);

/**
 * @route GET '/event/:idOfEvent'
 * @returns {JSON} of all the rounds from a certain event
 * @access Public
 */
router.get('/event/:idOfEvent', roundByEvent);

/**
 * @route GET '/:id'
 * @returns {JSON} of a specific rounds
 * @access Public
 */
router.get('/:id', findById);

/**
 * @route POST '/'
 * @returns new instance of the rounds
 * @access Public
 */
router.post('/', create);

/**
 * @route PUT '/:id'
 * @returns new instance of the rounds
 * @access Public
 */
router.put('/:id', update);

export default router;

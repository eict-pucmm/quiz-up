import express from 'express';
import { list, findById, create, update, listOldEvents } from './controller';

const router = express.Router();

/**
 * @route GET '/'
 * @returns {JSON} of all events
 * @access Public
 */
router.get('/', list);

/**
 * @route GET '/'
 * @returns {JSON} of all events that already passed
 * @access Public
 */
router.get('/old', listOldEvents);

/**
 * @route GET '/:id'
 * @returns {JSON} of a specific event
 * @access Public
 */
router.get('/:id', findById);

/**
 * @route POST '/'
 * @returns new instance of the Event
 * @access Public
 */
router.post('/', create);

/**
 * @route PUT '/:id'
 * @returns new instance of the Event
 * @access Public
 */
router.put('/:id', update);

export default router;

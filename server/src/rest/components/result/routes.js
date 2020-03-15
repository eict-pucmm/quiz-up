import express from 'express';
import { list, findById, create, update } from './controller';

const router = express.Router();

/**
 * @route GET '/'
 * @returns {JSON} of all results
 * @access Public
 */
router.get('/', list);

/**
 * @route GET '/:id'
 * @returns {JSON} of a specific result
 * @access Public
 */
router.get('/:id', findById);

/**
 * @route POST '/'
 * @returns new instance of the result
 * @access Public
 */
router.post('/', create);

/**
 * @route PUT '/:id'
 * @returns new instance of the result
 * @access Public
 */
router.put('/:id', update);

export default router;

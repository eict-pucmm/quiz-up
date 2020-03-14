import express from 'express';
import { list, findById, create } from './controller';

const router = express.Router();

/**
 * @route GET '/'
 * @returns {JSON} of all teams
 * @access Public
 */
router.get('/', list);

/**
 * @route GET '/:id'
 * @returns {JSON} of a specific team
 * @access Public
 */
router.get('/:id', findById);

/**
 * @route POST '/'
 * @returns new instance of the Team
 * @access Public
 */
router.post('/', create);

export default router;

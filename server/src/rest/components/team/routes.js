import express from 'express';
import { list, findById, create, remove } from './controller';

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

/**
 * @route DELETE '/:id'
 * @returns Message stating that the app it's subscribe
 * @access Public
 */
router.delete('/:id', remove);

export default router;

import express from 'express';

import authMiddleware from '../../middlewares/firebase-auth';
import { list, findById, create, update } from './controller';

const router = express.Router();

/**
 * @route GET '/'
 * @returns {JSON} of all admins
 * @access Public
 */
router.get('/', authMiddleware, list);

/**
 * @route GET '/:id'
 * @returns {JSON} of a specific admin
 * @access Public
 */
router.get('/:id', findById);

/**
 * @route POST '/'
 * @returns new instance of the admin
 * @access Public
 */
router.post('/', authMiddleware, create);

/**
 * @route PUT '/:id'
 * @returns new instance of the admin
 * @access Public
 */
router.put('/:id', authMiddleware, update);

export default router;

import express from 'express';
import {
  list,
  findById,
  create,
  findByMedicalCenter,
  update,
} from './controller';

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
 * @route GET '/mc?center=:CENTER_NAME'
 * @returns {JSON} of all teams under a medical center
 * @access Public
 */
router.get('/find/mc', findByMedicalCenter);

/**
 * @route POST '/'
 * @returns new instance of the Team
 * @access Public
 */
router.post('/', create);

/**
 * @route PUT '/:id'
 * @returns new instance of the Team
 * @access Public
 */
router.put('/:id', update);

export default router;

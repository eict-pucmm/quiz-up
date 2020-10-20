import express from 'express';
import { create } from './controller';

const router = express.Router();

router.get('/', create);

export default router;

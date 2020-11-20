import express from 'express';
import { create } from './controller';

const router = express.Router();

router.post('/', create);

export default router;

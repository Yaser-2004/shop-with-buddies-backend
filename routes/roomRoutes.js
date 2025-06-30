import express from 'express';
import { createRoom, getRoom, endRoom } from '../controllers/roomController.js';

const router = express.Router();

router.post('/create', createRoom);
router.get('/:roomCode', getRoom);
router.post('/end', endRoom)

export default router;

import express from 'express';
import { createRoom, getRoom, endRoom, getRoomMembers } from '../controllers/roomController.js';

const router = express.Router();

router.post('/create', createRoom);
router.get('/:roomCode', getRoom);
router.get('/:roomCode/members', getRoomMembers);
router.post('/end', endRoom)

export default router;

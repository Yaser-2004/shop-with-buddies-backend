import express from 'express';
import { createRoom, getRoom, endRoom, getRoomMembers, getSharedCart } from '../controllers/roomController.js';

const router = express.Router();

router.post('/create', createRoom);
router.get('/:roomCode', getRoom);
router.get('/:roomCode/members', getRoomMembers);
router.get('/:roomCode/cart', getSharedCart);
router.post('/end', endRoom)

export default router;

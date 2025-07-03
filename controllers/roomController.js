import Room from '../models/Room.js';
import generateRoomCode from '../utils/generateRoomCode.js';

// Create a new room
export const createRoom = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const roomCode = generateRoomCode();

    const newRoom = new Room({
      roomCode,
      host: userId,              // ✅ ObjectId of the host user
      members: [userId],         // ✅ Add host as initial member
      cart: [],
    });

    await newRoom.save();

    res.status(201).json({
      message: 'Room created successfully',
      roomCode,
    });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Join an existing room
export const getRoom = async (req, res) => {
  const { roomCode } = req.params;

  try {
    const room = await Room.findOne({ roomCode });

    if (!room) {
      return res.status(404).json({ error: 'Room not found' });
    }

    res.status(200).json(room);
  } catch (error) {
    console.error('Error fetching room:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/rooms/:roomCode/members
export const getRoomMembers = async (req, res) => {
  const { roomCode } = req.params;

  const room = await Room.findOne({ roomCode })
    .populate('members', 'firstName lastName _id')
    .populate('host', '_id');

  if (!room) return res.status(404).json({ message: "Room not found" });

  res.json({
    members: room.members,
    host: room.host._id
  });
};


export const endRoom = async (req, res) => {
  const { roomCode } = req.body;

  try {
    const result = await Room.findOneAndDelete({ roomCode });
    if (!result) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json({ message: 'Room ended and removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

import Room from '../models/Room.js';
import generateRoomCode from '../utils/generateRoomCode.js';

// Create a new room
export const createRoom = async (req, res) => {
  try {
    const { username } = req.body;

    const roomCode = generateRoomCode();

    const newRoom = new Room({
      roomCode,
      members: [username],
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

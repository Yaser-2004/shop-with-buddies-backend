import Room from '../models/Room.js';
import User from '../models/User.js';

export default function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // JOIN ROOM
    socket.on('join-room', async ({ roomCode, userId }) => {
        socket.join(roomCode);
        // io.to(roomCode).emit('user-joined', { userId });

        try {
            const room = await Room.findOne({ roomCode });
            if (!room) {
              return socket.emit('error', { message: 'Room not found' });
            }
            const alreadyMember = room.members.some(memberId => memberId.toString() === userId);

            if (!alreadyMember) {
              room.members.push(userId);
              await room.save();
            }

            const user = await User.findById(userId).select('-password');
            io.to(roomCode).emit('user-joined', { user });
        } catch (err) {
            console.error('Error updating room members:', err);
        }
    });

    // ADD TO CART
    socket.on('add-to-cart', async ({ roomCode, item }) => {
      socket.to(roomCode).emit('cart-updated', item);
    });

    // HOVERED PRODUCT
    socket.on('hover-product', ({ roomCode, user, productName }) => {
      socket.to(roomCode).emit('user-hovered', { user, productName });
    });

    // CHAT MESSAGE
    socket.on('send-message', ({ roomCode, message }) => {
        console.log(`Received message for room ${roomCode}:`, message);
      socket.to(roomCode).emit('receive-message', message);
    });

    socket.on('leave-room', async ({ roomCode, userId }) => {
      socket.leave(roomCode);
      console.log(`${userId} left ${roomCode}`);

      try {
        const room = await Room.findOne({ roomCode });

        if (!room) return;

        // Remove the userId from members
        room.members = room.members.filter(
          memberId => memberId.toString() !== userId
        );

        await room.save();

        // Notify others in the room
        socket.to(roomCode).emit('user-left', { userId });
      } catch (err) {
        console.error("Error removing user from room:", err);
      }
    });



    socket.on('end-room', (roomCode) => {
    io.to(roomCode).emit('room-ended');
    io.socketsLeave(roomCode); // disconnect all from room
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}

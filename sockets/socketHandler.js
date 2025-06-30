import Room from '../models/Room.js';

export default function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // JOIN ROOM
    socket.on('join-room', async ({ roomCode, username }) => {
        socket.join(roomCode);
        io.to(roomCode).emit('user-joined', { username });

        try {
            const room = await Room.findOne({ roomCode });
            const cleanUsername = username.trim().toLowerCase();

            const normalizedMembers = room.members.map(name => name.trim().toLowerCase());

            if (room && !normalizedMembers.includes(cleanUsername)) {
            room.members.push(username); // or cleanUsername, if you want lowercase in DB
            await room.save();
            }
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

    socket.on('leave-room', ({ roomCode, username }) => {
    socket.leave(roomCode);
    console.log(`${username} left ${roomCode}`);
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

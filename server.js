import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import roomRoutes from './routes/roomRoutes.js';
import productRoutes from './routes/productRoutes.js';
import socketHandler from './sockets/socketHandler.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));


//Routes
app.use('/api/rooms', roomRoutes);
app.use('/api/products', productRoutes);


// SOCKET.IO INIT
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",  // React frontend
    methods: ["GET", "POST"]
  }
});
socketHandler(io);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//H6t4N6bovXYlUxZe
//yasersiddiquee
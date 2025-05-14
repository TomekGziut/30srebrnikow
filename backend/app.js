require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');
const groupRoutes = require('./routes/group');
const http = require('http');
const { Server } = require('socket.io');
const Group = require('./models/Group');

const app = express();
const port = 5000;
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

const emitGroupsUpdate = async () => {
  const groups = await Group.find().populate('members', 'email username');
  io.emit('groupUpdated', groups);
};

app.use('/api/groups', (req, res, next) => {
  res.on('finish', emitGroupsUpdate);
  next();
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

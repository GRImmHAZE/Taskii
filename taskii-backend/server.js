const express = require('express');
const mongoose = require('mongoose');
const dbConfig = require('./config/db.config');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const reminderService = require('./services/reminderService');
const env = require('./config/env');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: env.FRONTEND_URL || 'http://localhost:4200' }
});

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

reminderService.setIO(io);

io.on('connection', (socket) => {
  socket.on('register-user', (userId) => {
    reminderService.registerUser(userId, socket);
  });

  socket.on('disconnect', () => {
    reminderService.removeUser(socket.id);
  });
});

const taskRoutes = require('./routes/task.routes');
app.use('/api/tasks', taskRoutes);

mongoose.connect(dbConfig.url).then(() => {
  console.log('✅ Connected to MongoDB');
  reminderService.startReminderJob();
  
  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`🔔 Reminder service active`);
  });
}).catch((err) => {
  console.error('❌ MongoDB connection failed:', err.message);
});

module.exports = server;

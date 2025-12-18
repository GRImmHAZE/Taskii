const cron = require('node-cron');
const Task = require('../models/task.model');

class ReminderService {
  constructor() {
    this.connectedUsers = new Map();
    this.io = null;
  }

  setIO(io) {
    this.io = io;
  }

  registerUser(userId, socket) {
    this.connectedUsers.set(userId, socket);
    console.log(`✅ User registered: ${userId}`);
    console.log(`📊 Total registered users: ${this.connectedUsers.size}`);
  }

  removeUser(userId) {
    this.connectedUsers.delete(userId);
    console.log(`❌ User removed: ${userId}`);
  }

  startReminderJob() {
    cron.schedule('* * * * *', async () => {
      await this.checkUpcomingTasks();
    });
    console.log('✅ Reminder job started');
  }

  async checkUpcomingTasks() {
    try {
      const now = new Date();
      const oneDay = 24 * 60 * 60 * 1000;

      const upcomingTasks = await Task.find({
        deadline: {
          $gte: now,
          $lte: new Date(now.getTime() + oneDay),
        },
        notificationSent: false,
      });

      for (const task of upcomingTasks) {
        const timeUntilDeadline = new Date(task.deadline).getTime() - now.getTime();

        if (timeUntilDeadline <= oneDay && timeUntilDeadline > 0) {
          await this.sendReminder(task);
          task.notificationSent = true;
          await task.save();
        }
      }
    } catch (error) {
      console.error('❌ Error checking upcoming tasks:', error);
    }
  }

  async sendReminder(task) {
    try {
      const reminderData = {
        taskId: task._id,
        title: task.title,
        deadline: task.deadline,
        message: `Reminder: "${task.title}" is due soon!`,
        category: task.category,
        importance: task.importance
      };

      if (task.userId) {
        const socket = this.connectedUsers.get(task.userId.toString());
        if (socket) {
          socket.emit('reminder', reminderData);
          console.log(`✅ Reminder sent to user: ${task.title}`);
        }
      }

      if (this.io) {
        this.io.emit('reminder-broadcast', reminderData);
      }
    } catch (error) {
      console.error('❌ Error sending reminder:', error);
    }
  }
}

module.exports = new ReminderService();
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      enum: ['Work', 'Personal', 'Study'],
      default: 'Personal',
    },
    deadline: {
      type: Date,
    },
    importance: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    notificationSent: {
      type: Boolean,
      default: false,
    },
    userId: {
      type: String,
    },
    userEmail: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);

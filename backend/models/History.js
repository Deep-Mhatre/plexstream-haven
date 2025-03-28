
const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mediaId: {
    type: String,
    required: true
  },
  mediaType: {
    type: String,
    enum: ['movie', 'tv'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index on userId and mediaId to prevent duplicates
historySchema.index({ userId: 1, mediaId: 1 }, { unique: true });

const History = mongoose.model('History', historySchema);

module.exports = History;

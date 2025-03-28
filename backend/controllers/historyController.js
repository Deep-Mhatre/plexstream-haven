
const History = require('../models/History');
const User = require('../models/User');

// @desc    Log media view in user history
// @route   POST /api/history/log
// @access  Private
const logMediaView = async (req, res) => {
  try {
    const { mediaId, mediaType, title } = req.body;
    
    if (!mediaId || !mediaType || !title) {
      return res.status(400).json({ error: 'Media ID, type, and title are required' });
    }
    
    // Update or create history entry
    const history = await History.findOneAndUpdate(
      { userId: req.user._id, mediaId },
      { userId: req.user._id, mediaId, mediaType, title, timestamp: Date.now() },
      { upsert: true, new: true }
    );
    
    res.status(200).json(history);
  } catch (error) {
    console.error('Log media view error:', error);
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// @desc    Get user watch history
// @route   GET /api/history
// @access  Private
const getUserHistory = async (req, res) => {
  try {
    const history = await History.find({ userId: req.user._id })
      .sort({ timestamp: -1 })
      .limit(20);
    
    res.json(history);
  } catch (error) {
    console.error('Get user history error:', error);
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

// @desc    Clear user history
// @route   DELETE /api/history
// @access  Private
const clearUserHistory = async (req, res) => {
  try {
    await History.deleteMany({ userId: req.user._id });
    res.json({ message: 'History cleared successfully' });
  } catch (error) {
    console.error('Clear user history error:', error);
    res.status(500).json({ error: error.message || 'Server Error' });
  }
};

module.exports = {
  logMediaView,
  getUserHistory,
  clearUserHistory
};

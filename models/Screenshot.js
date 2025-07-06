const mongoose = require('mongoose');

const ScreenshotSchema = new mongoose.Schema({
  filename: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Screenshot', ScreenshotSchema);

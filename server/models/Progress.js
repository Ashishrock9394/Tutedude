const mongoose = require('mongoose');

const IntervalSchema = new mongoose.Schema({
  start: Number,
  end: Number
});

const ProgressSchema = new mongoose.Schema({
  userId: String,
  videoId: String,
  intervals: [IntervalSchema],
  lastPosition: Number,
  videoLength: Number
});

module.exports = mongoose.model("Progress", ProgressSchema);

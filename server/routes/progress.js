const express = require("express");
const router = express.Router();
const Progress = require("../models/Progress");

// Merge overlapping time intervals
const mergeIntervals = (intervals) => {
  intervals.sort((a, b) => a.start - b.start);
  const merged = [];

  for (let i of intervals) {
    if (!merged.length || merged[merged.length - 1].end < i.start) {
      merged.push(i);
    } else {
      merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, i.end);
    }
  }

  return merged;
};

const calculateWatchedTime = (intervals) => {
  const merged = mergeIntervals(intervals);
  return merged.reduce((sum, i) => sum + (i.end - i.start), 0);
};

// Save progress route
router.post("/save", async (req, res) => {
  const { userId, videoId, newInterval, lastPosition, videoLength } = req.body;

  try {
    let progress = await Progress.findOne({ userId, videoId });

    if (!progress) {
      progress = new Progress({
        userId,
        videoId,
        intervals: [newInterval],
        lastPosition,
        videoLength,
      });
    } else {
      progress.intervals.push(newInterval);
      progress.intervals = mergeIntervals(progress.intervals);
      progress.lastPosition = lastPosition;
      progress.videoLength = videoLength;
    }

    await progress.save();

    const watched = calculateWatchedTime(progress.intervals);
    const percentage = (watched / progress.videoLength) * 100;

    res.json({
      intervals: progress.intervals,
      lastPosition: progress.lastPosition,
      videoLength: progress.videoLength,
      progressPercentage: percentage,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to save progress" });
  }
});

router.get("/:userId/:videoId", async (req, res) => {
      const { userId, videoId } = req.params;
    
      try {
        const progress = await Progress.findOne({ userId, videoId });
        if (!progress) {
          return res.json({ intervals: [], lastPosition: 0, videoLength: 0 });
        }
    
        res.json(progress);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch progress" });
      }
    });
    

module.exports = router;

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const LecturePlayer = ({ videoId, videoSrc }) => {
  const videoRef = useRef(null);
  const [userId, setUserId] = useState(null);
  const [currentStart, setCurrentStart] = useState(null);
  const [intervals, setIntervals] = useState([]);
  const [progress, setProgress] = useState(0);

  // Get IP address as userId
  useEffect(() => {
    const fetchIp = async () => {
      try {
        const res = await axios.get("https://api.ipify.org?format=json");
        setUserId(res.data.ip);
        console.log("Current IP as userId:", res.data.ip);
      } catch (err) {
        console.error("Failed to fetch IP", err);
      }
    };

    fetchIp();
  }, []);

  // Fetch existing progress
  useEffect(() => {
    if (!userId) return;

    const fetchProgress = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/progress/${userId}/${videoId}`);
        const { intervals, lastPosition, videoLength } = res.data;

        setIntervals(intervals);
        videoRef.current.currentTime = lastPosition || 0;

        const watched = calculateUniqueTime(intervals);
        const length = videoLength || videoRef.current?.duration || 1;
        setProgress((watched / length) * 100);
      } catch (err) {
        console.error("Error fetching progress:", err);
      }
    };

    fetchProgress();
  }, [userId, videoId]);

  // Track progress every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      const video = videoRef.current;
      if (video && !video.paused && !video.ended && userId) {
        const now = Math.floor(video.currentTime);
        if (currentStart === null) {
          setCurrentStart(now);
        }

        if (currentStart !== null && now > currentStart) {
          const newInterval = { start: currentStart, end: now };
          saveIntervalToBackend(newInterval, now);
          setCurrentStart(now);
        }
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [currentStart, userId]);

  // Save watched interval
  const saveIntervalToBackend = async (newInterval, lastPosition) => {
    if (!userId) return;

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/progress/save`, {
        userId,
        videoId,
        newInterval,
        lastPosition,
        videoLength: Math.floor(videoRef.current?.duration || 1),
      });

      const { intervals, videoLength } = res.data;
      setIntervals(intervals);

      const watched = calculateUniqueTime(intervals);
      const length = videoLength || videoRef.current?.duration || 1;
      setProgress((watched / length) * 100);
    } catch (err) {
      console.error("Error saving interval:", err);
    }
  };

  // Merge overlapping intervals
  const mergeIntervals = (intervals) => {
    const sorted = [...intervals].sort((a, b) => a.start - b.start);
    const merged = [];

    for (let i of sorted) {
      if (!merged.length || merged[merged.length - 1].end < i.start) {
        merged.push(i);
      } else {
        merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, i.end);
      }
    }

    return merged;
  };

  // Calculate total watched time
  const calculateUniqueTime = (intervals) => {
    const merged = mergeIntervals(intervals);
    return merged.reduce((sum, i) => sum + (i.end - i.start), 0);
  };

  return (
    <div>
      <video
        ref={videoRef}
        src={videoSrc}
        controls
        width="600"
        onPlay={() => {
          if (currentStart === null) {
            setCurrentStart(Math.floor(videoRef.current.currentTime));
          }
        }}
        onPause={() => {
          const now = Math.floor(videoRef.current.currentTime);
          if (currentStart !== null && now > currentStart) {
            const newInterval = { start: currentStart, end: now };
            saveIntervalToBackend(newInterval, now);
            setCurrentStart(null);
          }
        }}
      />
      <p>Progress: {progress.toFixed(2)}%</p>
    </div>
  );
};

export default LecturePlayer;

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const LecturePlayer = ({ userId, videoId, videoSrc }) => {
  const videoRef = useRef(null);
  const [currentStart, setCurrentStart] = useState(null);
  const [intervals, setIntervals] = useState([]);
  const [progress, setProgress] = useState(0);
  const [lastSavedSecond, setLastSavedSecond] = useState(null);
  
  // Fetch existing progress for each video
  useEffect(() => {
    axios.get(`http://localhost:5000/api/progress/${userId}/${videoId}`).then(res => {
      setIntervals(res.data.intervals);
      videoRef.current.currentTime = res.data.lastPosition || 0;
      const watched = calculateUniqueTime(res.data.intervals);
      const length = res.data.videoLength || 1;
      setProgress((watched / length) * 100);
      setLastSavedSecond(res.data.lastPosition || 0);
    });
  }, [userId, videoId]);

  // Periodic tracker every 1 second
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
        const now = Math.floor(videoRef.current.currentTime);
        const duration = Math.floor(videoRef.current.duration);

        if (currentStart === null) {
          setCurrentStart(now);
        }

        if (currentStart !== null && (now - currentStart >= 1 || now >= duration - 1)) {
          const newInterval = { start: currentStart, end: now };
          saveIntervalToBackend(newInterval, now);
          setCurrentStart(now);
        }
      }
    }, 1000); // Check every second

    return () => clearInterval(intervalId); // cleanup
  }, [currentStart]);

  const saveIntervalToBackend = (newInterval, lastPosition) => {
    axios.post('http://localhost:5000/api/progress/save', {
      userId,
      videoId,
      newInterval,
      lastPosition,
      videoLength: Math.floor(videoRef.current.duration)
    }).then(res => {
      setIntervals(res.data.intervals);
      const watched = calculateUniqueTime(res.data.intervals);      
      const length = res.data.videoLength || 1;
      setProgress((watched / length) * 100);
    });
  };

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
        onPlay={() => {
          if (currentStart === 0) {
            setCurrentStart(Math.floor(videoRef.current.currentTime));
          }
        }}
        onPause={() => {
          const now = Math.floor(videoRef.current.currentTime);
          if (currentStart !== null && now > currentStart) {
            const newInterval = { start: currentStart, end: now };
            saveIntervalToBackend(newInterval, now);
            setCurrentStart(0);
          }
        }}
        width="600"
      />
      <p>Progress: {progress.toFixed()}%</p>
    </div>
  );
};

export default LecturePlayer;

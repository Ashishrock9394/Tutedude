import React from 'react';
import LecturePlayer from './LecturePlayer'; // Import the modified LecturePlayer

const VideoPage = ({ userId }) => {
  // Array of video data with unique videoId and videoSrc URLs
  const videos = [
      { videoId: '1', videoSrc: 'https://videos.pexels.com/video-files/2887463/2887463-hd_1920_1080_25fps.mp4' },
      { videoId: '2', videoSrc: 'https://videos.pexels.com/video-files/1536322/1536322-hd_1920_1080_30fps.mp4' },
      { videoId: '3', videoSrc: 'https://videos.pexels.com/video-files/3191572/3191572-uhd_2560_1440_25fps.mp4' },
      { videoId: '4', videoSrc: 'https://videos.pexels.com/video-files/3466611/3466611-hd_1920_1080_30fps.mp4' },
      { videoId: '5', videoSrc: 'https://videos.pexels.com/video-files/3141207/3141207-uhd_2560_1440_25fps.mp4' },
  ];

  return (
    <div>
      <h1 style={{textAlign:'center'}}>Lecture Videos</h1>
      <div style={{ display: 'grid', justifyContent: 'space-around', gap: '20px' }}>
        {videos.map((video) => (
          <LecturePlayer
            key={video.videoId}
            userId={userId}
            videoId={video.videoId}
            videoSrc={video.videoSrc}
          />
        ))}
      </div>
    </div>
  );
};

export default VideoPage;

import React from 'react';
import VideoPage from './components/VideoPage';  // Import VideoPage component

function App() {
  const userId = "user123";  // Example userId, you can change it dynamically

  return (
    <div className="App">
      <VideoPage userId={userId} />
    </div>
  );
}

export default App;

import axios from "axios";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";

export default function CoursePage({ playlist, userId }) {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleVideoSelect = (videoId) => {
    const selected = playlist.videos.find((video) => video.videoId === videoId);
    setSelectedVideo(selected);
  };

  const handleCheckboxChange = async (index) => {
    try {
      const updatedVideos = [...playlist.videos];
      updatedVideos[index].watched = !updatedVideos[index].watched;

      // Update video completion status in the database
      await axios.put(
        `https://youtube-progress-tracker-api.onrender.com/playlists/${userId}/${playlist.playlistId}/videos/${updatedVideos[index].videoId}`,
        { watched: updatedVideos[index].watched }
      );
    } catch (error) {
      console.error("Error updating video status:", error);
    }
  };

  useEffect(() => {
    if (playlist.videos.length > 0) {
      setSelectedVideo(playlist.videos[0]);
    }
  }, [playlist]);

  return (
    <div className="flex flex-wrap modal-container bg-white p-4 md:p-8 rounded-lg shadow-lg items-center">
      <div className="w-full md:w-1/2 items-center">
      <p className="text-xl font-bold mb-2">{selectedVideo.title}</p>
        {selectedVideo && (
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${selectedVideo.videoId}`}
            controls={true}
            className="react-player"
            width="100%"
            // height="100%"
          />
        )}
      </div>
      <div className="w-full md:w-1/2 p-2">
        <p className="text-xl font-bold mb-2">{playlist.title}</p>
        {playlist.videos.map((video, index) => (
          <div
            key={index}
            className={`flex items-center cursor-pointer mb-2 p-2 ${
              video.watched ? "bg-gray-200" : ""
            }`}
            onClick={() => handleVideoSelect(video.videoId)}
          >
            <input
              type="checkbox"
              checked={video.watched}
              onChange={() => handleCheckboxChange(index)}
              className="mr-2"
            />
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-12 h-12 mr-2"
            />
            <div className="flex-grow">
              <p className="text-xs font-bold">{video.title}</p>
              <p className="text-xs">{video.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

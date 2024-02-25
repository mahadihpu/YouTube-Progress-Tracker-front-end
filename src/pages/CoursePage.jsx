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
      // setVideos(updatedVideos);

      // Update video completion status in the database
      await axios.put(
        `http://localhost:8080/playlists/${userId}/${playlist.playlistId}/videos/${updatedVideos[index].videoId}`,
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
    <div className="flex">
      <div className="w-2/4">
        {selectedVideo && (
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${selectedVideo.videoId}`}
            controls={true}
            width="500px"
          />
        )}
      </div>
      <div className="w-2/4">
        <div>
          <p className="text-xl font-bold mb-2">{playlist.title}</p>
          {playlist.videos.map((video, index) => (
            <div
              key={index}
              className={`flex items-center cursor-pointer mb-2 ${
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
              <div>
                <p className="text-xs font-bold">{video.title}</p>
                <p>{video.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

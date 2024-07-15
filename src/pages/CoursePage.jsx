import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import axios from "axios";

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return screenSize;
};

const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds === undefined) return "0h 0m 0s";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}h ${m}m ${s}s`;
};

export default function CoursePage({ playlist, userId, setPage }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isTheatreMode, setIsTheatreMode] = useState(false);

  const handleVideoSelect = (videoId) => {
    const selected = playlist.videos.find((video) => video.videoId === videoId);
    setSelectedVideo(selected);
  };

  console.log({playlist})

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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calculate total number of pages
  const totalPages = Math.ceil(playlist.videos.length / itemsPerPage);

  // Calculate index range for current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Slice the playlist to display only items for the current page
  const currentVideos = playlist.videos.slice(startIndex, endIndex);

  // Calculate percentage of watched videos
  const watchedCount = playlist.videos.filter((video) => video.watched).length;
  const progress = (watchedCount / playlist.videos.length) * 100;

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const { width } = useScreenSize();

  const isMobile = width <= 767;
  const isTablet = width > 767 && width <= 1024;

  // Add hypothetical durations for each video in seconds
  const videosWithDuration = playlist.videos.map((video, index) => ({
    ...video,
    duration: (index + 1) * 300, // 5 minutes per video as an example
  }));

  // Calculate total, watched, and remaining time
  const totalTime = videosWithDuration.reduce((sum, video) => sum + (video.duration || 0), 0);
  const watchedTime = videosWithDuration.reduce((sum, video) => video.watched ? sum + (video.duration || 0) : sum, 0);
  const remainingTime = totalTime - watchedTime;

  return (
    <div className={`flex flex-wrap bg-white p-6 md:p-10 rounded-lg shadow-lg ${isTheatreMode ? "theatre-mode" : ""}`}>
      <div className={`${isTheatreMode ? "w-full" : "w-full md:w-2/3"} mb-6 md:mb-0`}>
        <div className="flex items-center mb-4">
          <button
            className="flex items-center px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 transition-colors"
            onClick={() => setPage("home")}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
          <p className="text-2xl font-semibold ml-4">{selectedVideo?.title}</p>
          {!isMobile && !isTablet && (
            <button
              className="ml-auto px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              onClick={() => setIsTheatreMode(!isTheatreMode)}
            >
              {isTheatreMode ? "Exit Theatre Mode" : "Theatre Mode"}
            </button>
          )}
        </div>
        {selectedVideo && (
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${selectedVideo?.videoId}`}
            controls={true}
            className="react-player"
            width="100%"
            height={(isTheatreMode && !isMobile && !isTablet) ? "60vh" : "40vh"}
          />
        )}
        <div className="flex items-center justify-center mt-4 gap-3">
          <div className="bg-blue-200 h-2 flex-grow rounded-full overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-lg font-bold">{progress.toFixed(2)}%</p>
        </div>
        <div className="mt-4">
          <p className="text-lg font-semibold">Total Time: {formatTime(totalTime)}</p>
          <p className="text-lg font-semibold">Watched Time: {formatTime(watchedTime)}</p>
          <p className="text-lg font-semibold">Remaining Time: {formatTime(remainingTime)}</p>
        </div>
      </div>
      <div className={`p-2 ${isTheatreMode ? "w-full" : "w-full md:w-1/3"} bg-gray-50 rounded-lg`}>
        <p className="text-xl font-semibold mb-4">{playlist.title}</p>
        <div className="space-y-2">
          {currentVideos.map((video, index) => (
            <div
              key={index}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                video.watched ? "bg-gray-200" : "bg-white hover:bg-gray-100"
              }`}
              onClick={() => handleVideoSelect(video.videoId)}
            >
              <input
                type="checkbox"
                checked={video.watched}
                onChange={() => handleCheckboxChange(index)}
                className="mr-3"
              />
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-16 h-12 object-cover rounded mr-3"
              />
              <div className="flex-grow">
                <p className="text-sm font-semibold">{video.title}</p>
                <p className="text-sm text-gray-600">{video.description}</p>
              </div>
            </div>
          ))}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                className={`px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="mx-2">{currentPage}</span>
              <button
                className={`px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors ${
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

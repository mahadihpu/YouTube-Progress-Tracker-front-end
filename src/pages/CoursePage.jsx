import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import axios from "axios";

export default function CoursePage({ playlist, userId, setPage }) {
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

  return (
    <div className="flex flex-wrap modal-container bg-white p-4 md:p-8 rounded-lg shadow-lg">
      <div className="w-full md:w-1/2">
        <div className="flex mb-4 items-center">
          <button
            className="flex items-center px-2 py-2 rounded-md text-blue-500 border border-blue-500 text-white"
            onClick={() => setPage("home")}
            style={{ height: "40px", lineHeight: "40px" }}
          >
            <svg
              className="w-4 h-4 mr-1"
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
          <p className="text-xl font-bold mb-3 ml-2">{selectedVideo?.title}</p>
        </div>
        {selectedVideo && (
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${selectedVideo?.videoId}`}
            controls={true}
            className="react-player"
            width="100%"
            // height="100%"
          />
        )}
        <div className="flex items-center justify-center mt-4 gap-3">
          <div className="bg-blue-200 h-2 ml-4 flex-grow rounded-full">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-lg font-bold">{progress.toFixed(2)}%</p>
        </div>
      </div>
      <div className="w-full md:w-1/2 p-2">
        <p className="text-xl font-bold mb-2 ml-7">{playlist.title}</p>
        <div>
          {currentVideos.map((video, index) => (
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
                className="w-17 h-14 mr-2"
              />
              <div className="flex-grow">
                <p className="text-xs font-bold">{video.title}</p>
                <p className="text-xs">{video.description}</p>
              </div>
            </div>
          ))}
          {/* Display progress bar */}
          {/* <div className="flex items-center justify-center mt-4">
            <div className="bg-blue-200 h-2 w-full rounded-full">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div> */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <button
                className={`px-4 py-2 rounded-md bg-blue-500 text-white ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
                onClick={handlePrevPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="mx-2">{currentPage}</span>
              <button
                className={`px-4 py-2 rounded-md bg-blue-500 text-white ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-600"
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

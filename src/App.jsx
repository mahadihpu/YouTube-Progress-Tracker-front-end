import React, { useState, useEffect } from "react";
import "./index.css";
import axios from "axios";
import CoursePage from "./pages/CoursePage";
import CourseCard from "./components/Card";

const AddPlaylistModal = ({ onPlaylistAdded, setPage, setCurrentPlaylist }) => {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addingPlaylist, setAddingPlaylist] = useState(false);
  const [error, setError] = useState("");

  const fetchPlaylist = async () => {
    setLoading(true);
    try {
      const playlistResp = await axios.get(
        "https://youtube-progress-tracker-api.onrender.com/playlists/mahadi.gusion@gmail.com"
      );
      setCourses(playlistResp?.data);
    } catch (error) {
      console.error("Error fetching playlist:", error);
      setError("Error fetching playlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Call the async function
    fetchPlaylist();
  }, []);

  const handleAddPlaylist = async () => {
    if (!playlistUrl || !title || !description) {
      setError("Please fill in all fields");
      return;
    }
    setAddingPlaylist(true);
    try {
      // Extract playlist ID from the URL
      const playlistId = extractPlaylistId(playlistUrl);

      const response = await axios.post(
        "https://youtube-progress-tracker-api.onrender.com/playlists/mahadi.gusion@gmail.com",
        {
          playlistId: playlistId,
          title: title,
          description: description,
        }
      );
      console.log(response.data);
      // Reset the input fields after successful addition
      setPlaylistUrl("");
      setTitle("");
      setDescription("");
      // Notify parent component that playlist was added
      onPlaylistAdded();
    } catch (error) {
      console.error("Error adding playlist:", error);
    } finally {
      setAddingPlaylist(false);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    try {
      await axios.delete(
        `https://youtube-progress-tracker-api.onrender.com/playlists/mahadi.gusion@gmail.com/${playlistId}`
      );
      // Refresh the playlist after deletion
      fetchPlaylist();
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };

  // Function to extract playlist ID from URL
  const extractPlaylistId = (url) => {
    const urlParams = new URLSearchParams(url.split("?")[1]);
    return urlParams.get("list");
  };

  return (
    <div className="mb-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Add New Playlist</h2>
        <div className="mb-4">
          <label
            htmlFor="playlistUrl"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Playlist URL
          </label>
          <input
            type="text"
            id="playlistUrl"
            placeholder="Paste the playlist URL"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            placeholder="Enter the title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            placeholder="Enter the description"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex justify-between">
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
            Cancel
          </button>
          <button
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center ${
              addingPlaylist ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={handleAddPlaylist}
            disabled={addingPlaylist}
          >
            {addingPlaylist ? (
              <svg
                className="animate-spin h-5 w-5 mr-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 4.418 3.582 8 8 8v-4zm9-2.79A7.965 7.965 0 0120 12h-4c0 3.042-
                  8 6.126 8 12h4zm-2-5.291V4c3.418 0 6 3.582 6 8h-4a7.963 7.963 0 01-3-6.291z"
                ></path>
              </svg>
            ) : (
              "Add"
            )}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">
          Playlists ({courses.length})
        </h2>
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : (
          <>
            {courses.length === 0 ? (
              <p>No playlists found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {courses.map((course, index) => (
                  <CourseCard
                    key={index} // Ensure each child in a list has a unique "key" prop
                    title={course.title}
                    description={course.description}
                    onDelete={() => handleDeletePlaylist(course.playlistId)}
                    setPage={setPage}
                    course={course}
                    setCurrentPlaylist={setCurrentPlaylist}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [page, setPage] = useState("home");
  const [currentPlaylist, setCurrentPlaylist] = useState(null);

  const handlePlaylistAdded = () => {
    // Handle playlist added event
    // You can update the state or perform any necessary actions
  };

  return (
    <div className="p-8">
      {page === "home" && (
        <AddPlaylistModal
          onPlaylistAdded={handlePlaylistAdded}
          setPage={setPage}
          setCurrentPlaylist={setCurrentPlaylist}
        />
      )}
      {page === "course" && (
        <CoursePage
          playlist={currentPlaylist}
          userId="mahadi.gusion@gmail.com"
          setPage={setPage}
        />
      )}
    </div>
  );
};

export default App;

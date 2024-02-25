import React, { useState, useEffect } from "react";
import "./index.css";
import axios from "axios";
import CoursePage from "./pages/CoursePage";
import CourseCard from "./components/Card";

const AddPlaylistModal = ({ onPlaylistAdded, setPage, setCurrentPlaylist }) => {
  const [playlistId, setPlaylistId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courses, setCourses] = useState([]);
  const fetchPlaylist = async () => {
    try {
      const playlistResp = await axios.get(
        "http://localhost:8080/playlists/mahadi.gusion@gmail.com"
      );
      setCourses(playlistResp?.data);
    } catch (error) {
      console.error("Error fetching playlist:", error);
    }
  };

  useEffect(() => {
    // Call the async function
    fetchPlaylist();
  }, []);

  const handleAddPlaylist = async () => {
    try {
      const response = await axios.post("http://localhost:8080/playlists/mahadi.gusion@gmail.com", {
        playlistId: playlistId,
        title: title,
        description: description,
      });
      console.log(response.data);
      // Reset the input fields after successful addition
      setPlaylistId("");
      setTitle("");
      setDescription("");
      // Notify parent component that playlist was added
      onPlaylistAdded();
    } catch (error) {
      console.error("Error adding playlist:", error);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    try {
      await axios.delete(
        `http://localhost:8080/playlists/mahadi.gusion@gmail.com/${playlistId}`
      );
      // Refresh the playlist after deletion
      fetchPlaylist();
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };

  return (
    <div className="mb-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Add New Playlist</h2>
        <div className="mb-4">
          <label
            htmlFor="playlistName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Playlist ID
          </label>
          <input
            type="text"
            id="playlistName"
            placeholder="Enter the playlist id"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={playlistId}
            onChange={(e) => setPlaylistId(e.target.value)}
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
        <div
          className="mb-4
"
        >
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
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
            onClick={handleAddPlaylist}
          >
            Add
          </button>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Playlists</h2>
        {courses.map((course, index) => (
          <CourseCard
            title={course.title}
            description={course.description}
            onDelete={() => handleDeletePlaylist(course.playlistId)}
            setPage={setPage}
            course={course}
            setCurrentPlaylist={setCurrentPlaylist}
          />
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const [page, setPage] = useState("home");
  const [currentPlaylist, setCurrentPlaylist] = useState(null)

  const handlePlaylistAdded = () => {
    // Handle playlist added event
    // You can update the state or perform any necessary actions
  };

  return (
    <div className="p-8">
      {page === "home" && (
        <AddPlaylistModal onPlaylistAdded={handlePlaylistAdded} setPage={setPage} setCurrentPlaylist={setCurrentPlaylist} />
      )}
      {page === "course" && <CoursePage playlist={currentPlaylist} userId="mahadi.gusion@gmail.com"/>}
    </div>
  );
};

export default App;

import React, { useState, useEffect } from "react";
import "./index.css";
import axios from "axios";
import CoursePage from "./pages/CoursePage";
import CourseCard from "./components/Card";


const AddPlaylistModal = () => {
  const [playlistId, setPlaylistId] = useState("");

  const handleAddPlaylist = async () => {
    try {
      const response = await axios.post("http://localhost:8080/playlists/mahadi.gusion@gmail.com", {
        playlistId: playlistId
      });
      console.log(response.data);
      // Reset the input field after successful addition
      setPlaylistId("");
    } catch (error) {
      console.error("Error adding playlist:", error);
    }
  };

  return (
    <div className="mb-8">
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
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
    </div>
  );
};

const App = () => {
  const [page, setPage] = useState("home")
  useEffect(() => {
    // This function is marked as async to use await inside it
    const fetchPlaylist = async () => {
      try {
        // Await the promise to resolve and get the actual response
        const playlistResp = await axios.get(
          "http://localhost:8080/playlists/mahadi.gusion@gmail.com" // Replace with actual user ID
        );

        // Log the response data
        console.log(playlistResp.data);
      } catch (error) {
        // Handle any errors here
        console.error("Error fetching playlist:", error);
      }
    };

    // Call the async function
    fetchPlaylist();
  }, []);
  return (
    <div className="p-8">
 {
  page === "home" &&   <div>
  <AddPlaylistModal />
     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
       <CourseCard
         title="Product Management"
         progress={75}
         description="This is a course"
       />
       <CourseCard
         title="Web Development"
         progress={75}
         description="This is a course"
         setPage={setPage}
       />
     </div>
  </div>
 }
 {
  page === "course" && <CoursePage />
 }
    </div>
  );
};

export default App;

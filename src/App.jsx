import React from 'react';
import './index.css';


const CourseCard = ({ title, progress, description }) => {
  return (
    <div className="p-4 rounded-lg shadow-md">
      <div className="mt-4">
        <h5 className="text-lg font-bold">{title}</h5>
        <p className="text-sm text-gray-600">{description}</p>
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      <button className="mt-4 bg-blue-500 text-white p-2 rounded-lg w-full">
        View
      </button>
    </div>
  );
};

const AddPlaylistModal = () => {
  return (
    <div className='mb-8'>
      <div className="bg-white p-8 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl font-bold mb-4">Add New Playlist</h2>
        <div className="mb-4">
          <label htmlFor="playlistName" className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            id="playlistName"
            placeholder="Enter item name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="playlistDescription" className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            id="playlistDescription"
            placeholder="Enter item description"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            rows="3"
          ></textarea>
        </div>
        <div className="flex justify-between">
          <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
            Cancel
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="p-8">
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
        />
      </div>
    </div>
  );
};

export default App;

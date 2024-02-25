import React from "react";

const CourseCard = ({ title, description, onDelete,setPage,course, setCurrentPlaylist }) => {

  const handlePageChange = () => {
    setPage("course")
    setCurrentPlaylist(course)
  }

    return (
      <div className="p-4 rounded-lg shadow-md">
        <div className="mt-4">
          <h5 className="text-lg font-bold">{title}</h5>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button className="bg-blue-500 text-white p-2 rounded-lg" onClick={onDelete}>
            Delete
          </button>
          <button className="bg-blue-500 text-white p-2 rounded-lg" onClick={handlePageChange}>
            View
          </button>
        </div>
      </div>
    );
};

export default CourseCard;

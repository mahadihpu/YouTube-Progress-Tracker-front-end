import React from "react";
import { MdDelete } from "react-icons/md";

const CourseCard = ({
  title,
  description,
  onDelete,
  setPage,
  course,
  setCurrentPlaylist,
}) => {
  const handlePageChange = () => {
    setPage("course");
    setCurrentPlaylist(course);
  };

  const thumbnail = course.videos && course.videos.length > 0 ? course.videos[0].thumbnail : '';

  // Calculate the progress percentage
  const totalVideos = course.videos ? course.videos.length : 0;
  const watchedVideos = course.videos ? course.videos.filter(video => video.watched).length : 0;
  const progress = totalVideos > 0 ? (watchedVideos / totalVideos) * 100 : 0;

  return (
    <div className="p-4 rounded-lg shadow-md flex flex-col h-full">
      <div className="flex-grow">
        {/* Display the image if thumbnail exists */}
        {thumbnail && <img src={thumbnail} alt="Thumbnail" className="mb-2 w-full h-auto" />}
        <h5 className="text-lg font-bold">{title}</h5>
        <p className="text-sm text-gray-600">{description}</p>
        {/* Display progress bar and percentage */}
        <div className="flex items-center mt-2">
          <div className="bg-blue-200 h-2 w-full rounded-md overflow-hidden">
            <div className="bg-blue-500 h-2" style={{ width: `${progress}%` }}></div>
          </div>
          <span className="ml-2">{progress.toFixed(2)}%</span>
        </div>
      </div>
      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-green-500 text-white py-1 px-3 rounded-lg"
          onClick={handlePageChange}
        >
          View
        </button>
        <MdDelete className="text-red-500 text-2xl cursor-pointer" onClick={onDelete} />
      </div>
    </div>
  );
};

export default CourseCard;

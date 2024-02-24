
const CourseCard = ({ title, progress, description, setPage }) => {
    return (
      <div className="p-4 rounded-lg shadow-md">
        <div className="mt-4">
          <h5 className="text-lg font-bold">{title}</h5>
          <p className="text-sm text-gray-600">{description}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mt-2">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <button className="mt-4 bg-blue-500 text-white p-2 rounded-lg w-full" onClick={() => setPage("course")}>
          View
        </button>
      </div>
    );
  };

  export default CourseCard;
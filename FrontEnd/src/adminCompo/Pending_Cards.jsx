import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { set_all_emp_data } from '../store/slices/UserSlice';

const Pending_Cards = ({ data, property }) => {
  const { all_emp_data } = useSelector((result) => result.data);
  const dispatch = useDispatch();

  const handleAction = async (btn) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/markAttendance`,
        { _id: data._id, btn, property }
      );
      const updatedUsers = all_emp_data.map((emp) => 
        emp._id === response.data.updatedUser._id 
          ? { ...emp, 
              attendance: response.data.updatedUser.attendance, 
              leaves: response.data.updatedUser.leaves 
            } 
          : emp
      );
      alert(`${property} has been ${btn}`);
      dispatch(set_all_emp_data(updatedUsers));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4 mb-3 border-l-4 border-yellow-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center">
            <span className="text-xs sm:text-sm text-gray-400 mr-2">Employee:</span>
            <span className="text-sm sm:text-base font-medium text-white">
              {data.user.fullname}
            </span>
          </div>
          <div className="flex items-center">
            <span className="text-xs sm:text-sm text-gray-400 mr-2">Date:</span>
            <span className="text-sm sm:text-base text-white">
              {new Date(data.date).toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric'
              })}
            </span>
          </div>
        </div>

        {property === 'leaves' && (
          <div className="mt-2 sm:mt-0">
            <span className="text-xs sm:text-sm text-gray-400">Reason:</span>
            <p className="text-sm sm:text-base text-white bg-gray-700 p-2 rounded mt-1">
              {data.reason}
            </p>
          </div>
        )}

        <div className="flex gap-2 mt-3 sm:mt-0 justify-end">
          <button 
            onClick={() => handleAction("accepted")}
            className="px-3 py-1 sm:px-4 sm:py-2 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm font-medium rounded transition-colors"
          >
            Accept
          </button>
          <button 
            onClick={() => handleAction("rejected")}
            className="px-3 py-1 sm:px-4 sm:py-2 bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-medium rounded transition-colors"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pending_Cards;
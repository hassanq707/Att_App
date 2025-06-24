import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { update_att_info } from '../store/slices/UserSlice';

const Leave = () => {
  const { att_info } = useSelector((state) => state.data);
  const { token } = useSelector((data) => data.auth);
  const [leaves, setLeaves] = useState(att_info['leaves'] || []);
  const [formData, setFormData] = useState({ date: '', reason: '' });
  const dispatch = useDispatch();

  useEffect(() => {
    if (att_info.leaves) {
      setLeaves(att_info.leaves);
    }
  }, [att_info]);

  const pendingLeaves = leaves.filter(result => result.status === "pending");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/leave`,
        formData,
        { headers: { token } }
      );
      alert("Leave request submitted successfully");
      dispatch(update_att_info({ data: response.data, category: 'leaves' }));
      setFormData({ date: '', reason: '' });
    } catch (error) {
      console.error("Leave error:", error);
      alert(error.response?.data?.message || "Failed to submit leave request");
    }
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 border border-gray-700">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Apply for Leave
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-300 mb-1">Leave Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 text-sm sm:text-base"
                required
              />
            </div>
            <div>
              <label className="block text-sm sm:text-base font-medium text-gray-300 mb-1">Reason</label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Enter reason for leave"
                rows="3"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 text-sm sm:text-base"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-medium rounded-lg transition-all duration-300 text-sm sm:text-base"
            >
              Submit Leave Request
            </button>
          </form>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 border border-gray-700">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Pending Leave Requests
          </h2>
          {pendingLeaves.length > 0 ? (
            <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto pr-2">
              {pendingLeaves.map((leave) => (
                <div key={leave._id} className="bg-gray-700 p-4 rounded-lg border-l-4 border-yellow-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-gray-400">Leave Date</p>
                      <p className="font-medium text-white text-sm mb-2">
                        {new Date(leave.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-xs text-gray-400">Reason</p>
                      <p className="text-white text-sm">{leave.reason}</p>
                    </div>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500 text-white">
                      Pending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">No pending leave requests</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Leave;

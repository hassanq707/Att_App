import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios';
import { update_att_info } from "../store/slices/UserSlice";

const Attendance = () => {
  const { att_info } = useSelector((state) => state.data);
  const { emp_data: user } = useSelector((state) => state.data);
  const { token } = useSelector(data => data.auth);
  const [attendance, setAttendance] = useState(att_info['attendance'] || []);
  const dispatch = useDispatch();

  useEffect(() => {
    if (att_info.attendance) {
      setAttendance(att_info.attendance);
    }
  }, [att_info]);

  const today = new Date().toISOString().split("T")[0];
  const pendingAttendances = attendance.filter(result => result.status === "pending");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/attendance`, 
        { today, _id: user._id },
        { headers: { token } }
      );
      alert(response.data.message || "Attendance submitted successfully");
      dispatch(update_att_info({ data: response.data, category: 'attendance' }));
    } catch (err) {
      console.error("Attendance error:", err);
      alert(err.response?.data?.message || "Failed to submit attendance");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        <div className="bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 border border-gray-700">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Mark Today's Attendance
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-1">Date</label>
                <input
                  type="text"
                  value={today}
                  disabled
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-300 mb-1">Employee Name</label>
                <input
                  type="text"
                  value={user.fullname || ""}
                  disabled
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 text-sm sm:text-base"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-2 sm:py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-400 hover:from-blue-600 hover:to-cyan-500 text-white font-medium rounded-lg transition-all duration-300 text-sm sm:text-base"
            >
              Submit Attendance
            </button>
          </form>
        </div>

        <div className="bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 border border-gray-700">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Pending Approvals
          </h2>
          {pendingAttendances.length > 0 ? (
            <div className="space-y-3 sm:space-y-4 max-h-80 sm:max-h-96 overflow-y-auto pr-2">
              {pendingAttendances.map((att) => (
                <div key={att._id} className="bg-gray-700 p-3 sm:p-4 rounded-lg border-l-4 border-yellow-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-400">Date</p>
                      <p className="font-medium text-white text-sm sm:text-base">
                        {new Date(att.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <span className="px-2 sm:px-3 py-1 text-xs font-semibold rounded-full bg-yellow-500 text-white">
                        Pending
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <p className="text-gray-400 text-sm sm:text-base">No pending attendance records</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;  
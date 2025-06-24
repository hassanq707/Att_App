import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Pending_Cards from './Pending_Cards';

const Req_Attendance = () => {
  const { all_emp_data } = useSelector(result => result.data);
  const [btn, setBtn] = useState("attendance");
  const [data, setData] = useState([]);

  useEffect(() => {
    if (all_emp_data?.length > 0) {
      const filteredData = all_emp_data.flatMap(emp =>
        (emp[btn])
          .filter(record => record.status === "pending")
          .map(record => ({
            ...record,
            user: emp.user
          }))
      );
      setData(filteredData);
    }
  }, [btn, all_emp_data]);

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700 mx-2 sm:mx-0">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
        Pending Approvals
      </h2>

      <div className="flex gap-2 sm:gap-3 mb-4">
        <button 
          className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
            btn === "attendance" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={() => setBtn("attendance")}
        >
          Attendance
        </button>
        <button 
          className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
            btn === "leaves" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
          onClick={() => setBtn("leaves")}
        >
          Leaves
        </button>
      </div>

      {data.length > 0 ? (
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {data.map((elem) => (
            <Pending_Cards key={elem._id} data={elem} property={btn} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-400 text-sm sm:text-base">
            No pending {btn} requests
          </p>
        </div>
      )}
    </div>
  );
};

export default Req_Attendance;
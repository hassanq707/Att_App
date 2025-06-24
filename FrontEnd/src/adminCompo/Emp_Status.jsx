import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Emp_Status = () => {
  const { all_emp_data } = useSelector(state => state.data);
  const employees = all_emp_data.filter(emp => emp.user.role === 'employee');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [tab, setTab] = useState('attendance');
  const [filteredData, setFilteredData] = useState([]);
  const [attendancePercentage, setAttendancePercentage] = useState(0);

  useEffect(() => {
    if (!selectedUser) return;

    const user = employees.find(emp => emp.user._id === selectedUser);
    if (!user) return;

    const monthData = user[tab]?.filter(item =>
      new Date(item.date).getMonth() + 1 === selectedMonth
    ) || [];

    setFilteredData(monthData);

    if (tab === 'attendance') {
      const totalDays = monthData.length;
      const presentDays = monthData.filter(item => item.status === 'accepted').length;
      setAttendancePercentage(totalDays ? (presentDays / totalDays) * 100 : 0);
    }
  }, [selectedUser, selectedMonth, tab, all_emp_data]);

  const chartData = {
    labels: filteredData.map(item => new Date(item.date).getDate()),
    datasets: [{
      label: `${tab === 'attendance' ? 'Attendance' : 'Leave'} Status`,
      data: filteredData.map(item => item.status === 'accepted' ? 1 : item.status === 'rejected' ? -1 : 0),
      backgroundColor: filteredData.map(item => 
        item.status === 'accepted' ? 'rgba(75, 192, 192, 0.6)' : 
        item.status === 'rejected' ? 'rgba(255, 99, 132, 0.6)' : 'rgba(255, 206, 86, 0.6)'
      ),
      borderColor: filteredData.map(item => 
        item.status === 'accepted' ? 'rgba(75, 192, 192, 1)' : 
        item.status === 'rejected' ? 'rgba(255, 99, 132, 1)' : 'rgba(255, 206, 86, 1)'
      ),
      borderWidth: 1
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: `${new Date(2025, selectedMonth-1).toLocaleString('default', {month:'long'})} ${tab==='attendance'?'Attendance':'Leave'} Records`,
        color: '#ffffff',
        font: { size: 14 }
      },
    },
    scales: {
      y: {
        ticks: { color: '#ffffff', font: {size:10} },
        grid: { color: 'rgba(255,255,255,0.1)' }
      },
      x: {
        ticks: { color: '#ffffff', font: {size:10} },
        grid: { color: 'rgba(255,255,255,0.1)' }
      }
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 border border-gray-700 mx-2 sm:mx-0">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
        Employee Work Status
      </h2>

      <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
        <select 
          className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          onChange={e => setSelectedUser(e.target.value)} 
          value={selectedUser}
        >
          <option value="">Select Employee</option>
          {employees.map(emp => (
            <option key={emp.user._id} value={emp.user._id}>
              {emp.user.fullname}
            </option>
          ))}
        </select>

        <button 
          className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
            tab === 'attendance' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          onClick={() => setTab('attendance')}
        >
          Attendance
        </button>
        <button 
          className={`px-3 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
            tab === 'leaves' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
          onClick={() => setTab('leaves')}
        >
          Leaves
        </button>
        
        <select 
          className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          onChange={e => setSelectedMonth(Number(e.target.value))} 
          value={selectedMonth}
        >
          {[...Array(12)].map((_, i) => (
            <option key={i+1} value={i+1}>
              {new Date(2025, i).toLocaleString('default', {month:'long'})}
            </option>
          ))}
        </select>
      </div>

      {tab === 'attendance' && filteredData.length > 0 && (
        <div className="mb-4 p-3 bg-gray-700 rounded-lg">
          <h3 className="text-sm sm:text-base font-semibold text-white mb-2">
            Attendance Summary: {attendancePercentage.toFixed(1)}%
          </h3>
          <div className="w-full bg-gray-600 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full" 
              style={{width: `${attendancePercentage}%`}}
            ></div>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            {filteredData.filter(i => i.status === 'accepted').length} days present out of {filteredData.length}
          </p>
        </div>
      )}

      <div className="mb-4" style={{height: '250px'}}>
        <Bar data={chartData} options={options} />
      </div>

      <div className="space-y-2 max-h-80 sm:max-h-96 overflow-y-auto">
        {filteredData.length > 0 ? (
          filteredData.map(item => (
            <div key={item._id} className={`p-3 rounded-lg border-l-4 ${
              item.status === 'accepted' ? 'border-green-500' :
              item.status === 'rejected' ? 'border-red-500' : 'border-yellow-500'
            } bg-gray-700`}>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs sm:text-sm text-gray-400">Date</p>
                  <p className="text-white text-sm sm:text-base">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      weekday: 'short', month: 'short', day: 'numeric'
                    })}
                  </p>
                  {tab === 'leaves' && item.reason && (
                    <>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1">Reason</p>
                      <p className="text-white text-sm sm:text-base">{item.reason}</p>
                    </>
                  )}
                </div>
                <span className={`px-2 sm:px-3 py-1 text-xs font-semibold rounded-full ${
                  item.status === 'accepted' ? 'bg-green-500' :
                  item.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                } text-white`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-400 text-sm sm:text-base">
              {selectedUser ? 'No records found' : 'Select an employee to view records'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Emp_Status;
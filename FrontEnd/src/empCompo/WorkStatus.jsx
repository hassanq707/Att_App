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

const WorkStatus = () => {
  const { att_info } = useSelector(state => state.data);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [tab, setTab] = useState('attendance');
  const [filteredData, setFilteredData] = useState([]);
  const [attendancePercentage, setAttendancePercentage] = useState(0);

  useEffect(() => {
    if (!att_info) return;

    const monthData = att_info[tab]?.filter(item =>
      new Date(item.date).getMonth() + 1 === selectedMonth
    ) || [];

    setFilteredData(monthData);

    if (tab === 'attendance') {
      const totalDays = monthData.length;
      const presentDays = monthData.filter(item => item.status === 'accepted').length;
      setAttendancePercentage(totalDays ? (presentDays / totalDays) * 100 : 0);
    }
  }, [selectedMonth, tab, att_info]);

  const chartData = {
    labels: filteredData.map(item => new Date(item.date).getDate()),
    datasets: [
      {
        label: tab === 'attendance' ? 'Attendance Status' : 'Leave Status',
        data: filteredData.map(item => {
          if (tab === 'attendance') {
            return item.status === 'accepted' ? 1 : 0;
          } else {
            return item.status === 'accepted' ? 1 : item.status === 'rejected' ? -1 : 0;
          }
        }),
        backgroundColor: filteredData.map(item => {
          if (tab === 'attendance') {
            return item.status === 'accepted' ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)';
          } else {
            return item.status === 'accepted' 
              ? 'rgba(75, 192, 192, 0.6)' 
              : item.status === 'rejected' 
                ? 'rgba(255, 99, 132, 0.6)' 
                : 'rgba(255, 206, 86, 0.6)';
          }
        }),
        borderColor: filteredData.map(item => {
          if (tab === 'attendance') {
            return item.status === 'accepted' ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)';
          } else {
            return item.status === 'accepted' 
              ? 'rgba(75, 192, 192, 1)' 
              : item.status === 'rejected' 
                ? 'rgba(255, 99, 132, 1)' 
                : 'rgba(255, 206, 86, 1)';
          }
        }),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff'
        }
      },
      title: {
        display: true,
        text: `${new Date(2025, selectedMonth - 1).toLocaleString('default', { month: 'long' })} ${tab === 'attendance' ? 'Attendance' : 'Leave'} Records`,
        color: '#ffffff',
        font: { size: 14 }
      },
    },
    scales: {
      y: {
        ticks: { color: '#ffffff', font: { size: 12 } },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      },
      x: {
        ticks: { color: '#ffffff', font: { size: 12 } },
        grid: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    }
  };

  return (
    <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-gray-800 rounded-xl shadow-lg p-5 sm:p-6 border border-gray-700">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Work Status Dashboard
        </h2>

        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setTab('attendance')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              tab === 'attendance' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Attendance
          </button>
          <button
            onClick={() => setTab('leaves')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
              tab === 'leaves' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Leaves
          </button>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg border border-gray-600 text-sm sm:text-base"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2025, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>

        {tab === 'attendance' && (
          <div className="mb-6 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
              Attendance Summary
            </h3>
            <div className="flex items-center">
              <div className="w-full bg-gray-600 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full"
                  style={{ width: `${attendancePercentage}%` }}
                ></div>
              </div>
              <span className="ml-4 text-white font-medium text-base">
                {attendancePercentage.toFixed(1)}%
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              {filteredData.filter(item => item.status === 'accepted').length} days present out of {filteredData.length}
            </p>
          </div>
        )}

        <div className="mb-6" style={{ height: '250px' }}>
          <Bar data={chartData} options={options} />
        </div>

        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredData.length > 0 ? (
            filteredData.map(item => (
              <div
                key={item._id}
                className={`p-4 rounded-lg border-l-4 ${
                  item.status === 'accepted'
                    ? 'bg-gray-700 border-green-500'
                    : item.status === 'rejected'
                    ? 'bg-gray-700 border-red-500'
                    : 'bg-gray-700 border-yellow-500'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-400">Date</p>
                    <p className="text-white font-medium text-base">
                      {new Date(item.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    {tab === 'leaves' && item.reason && (
                      <>
                        <p className="text-xs text-gray-400 mt-2">Reason</p>
                        <p className="text-white text-base">{item.reason}</p>
                      </>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      item.status === 'accepted'
                        ? 'bg-green-500 text-white'
                        : item.status === 'rejected'
                        ? 'bg-red-500 text-white'
                        : 'bg-yellow-500 text-white'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 text-sm">No records found for selected month</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkStatus;

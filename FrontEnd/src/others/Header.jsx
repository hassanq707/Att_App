import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clear_token } from '../store/slices/TokenSlice';
import { clear_emp_data } from '../store/slices/UserSlice';

const Header = ({ name }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { emp_data } = useSelector((state) => state.data);
  const role = emp_data?.role || "admin";

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/logout`);
      dispatch(clear_token());
      dispatch(clear_emp_data());
      localStorage.removeItem("token")
      navigate('/login');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <header className={`bg-gray-900 text-white shadow-xl sticky top-0 z-50 border-b border-gray-700 ${role == "admin" ? "mb-6" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex items-center justify-between h-20">

          <div className="flex-shrink-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tight">
              Attendance Pro
            </h1>
          </div>

          <div className="hidden md:flex flex-1 justify-center px-4">
            <nav className="flex items-center space-x-1 lg:space-x-2">
              {role === "employee" ? (
                <>
                  <NavLink 
                    to="/" 
                    className={({ isActive }) => 
                      `px-4 py-2 rounded-lg text-md font-semibold transition-all ${
                        isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`
                    }
                  >
                    Attendance
                  </NavLink>
                  <NavLink 
                    to="/leave" 
                    className={({ isActive }) => 
                      `px-4 py-2 rounded-lg text-md font-semibold transition-all ${
                        isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`
                    }
                  >
                    Leave
                  </NavLink>
                  <NavLink 
                    to="/status" 
                    className={({ isActive }) => 
                      `px-4 py-2 rounded-lg text-md font-semibold transition-all ${
                        isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`
                    }
                  >
                    Status
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink 
                    to="/admin" 
                    end
                    className={({ isActive }) => 
                      `px-4 py-2 rounded-lg text-md font-semibold transition-all ${
                        isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`
                    }
                  >
                    Requests
                  </NavLink>
                  <NavLink 
                    to="/admin/Emp_Status" 
                    className={({ isActive }) => 
                      `px-4 py-2 rounded-lg text-md font-semibold transition-all ${
                        isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      }`
                    }
                  >
                    Employees
                  </NavLink>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="text-right">
              <p className="hidden sm:block text-xs text-gray-400 uppercase tracking-wider">Welcome</p>
              <p className="text-sm font-medium text-gray-100 truncate max-w-[100px] sm:max-w-[160px] lg:max-w-[200px]">
                {name}
              </p>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition-all shadow hover:shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden py-3 -mx-4 px-4 border-t border-gray-800 flex overflow-x-auto space-x-2 scrollbar-hide">
          {role === "employee" ? (
            <>
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `px-3 py-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-all ${
                    isActive ? 'bg-blue-600 text-white shadow' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                Attendance
              </NavLink>
              <NavLink 
                to="/leave" 
                className={({ isActive }) => 
                  `px-3 py-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-all ${
                    isActive ? 'bg-blue-600 text-white shadow' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                Leave
              </NavLink>
              <NavLink 
                to="/status" 
                className={({ isActive }) => 
                  `px-3 py-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-all ${
                    isActive ? 'bg-blue-600 text-white shadow' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                Status
              </NavLink>
            </>
          ) : (
            <>
              <NavLink 
                to="/admin" 
                end
                className={({ isActive }) => 
                  `px-3 py-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-all ${
                    isActive ? 'bg-blue-600 text-white shadow' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                Requests
              </NavLink>
              <NavLink 
                to="/admin/Emp_Status" 
                className={({ isActive }) => 
                  `px-3 py-1.5 whitespace-nowrap rounded-md text-sm font-medium transition-all ${
                    isActive ? 'bg-blue-600 text-white shadow' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                Employees
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
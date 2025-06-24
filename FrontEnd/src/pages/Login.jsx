import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { set_att_info, set_emp_data } from '../store/slices/UserSlice';
import { useDispatch } from 'react-redux';
import { set_token } from '../store/slices/TokenSlice';

const Login = () => {
  const [data, setData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onChangeHandle = (e) => {
    if (error) setError(null);
    const { value, name } = e.target;
    setData({
      ...data,
      [name]: value
    });
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/login`, data);
      const { user, userData, token } = response.data;

      dispatch(set_emp_data(user));
      dispatch(set_att_info(userData));
      dispatch(set_token(token));
      localStorage.setItem("token", token);

      setData({ email: '', password: '' });

      if (user.role === "admin") navigate("/admin");
      else navigate("/");
    } catch (error) {
      console.log(error);
      if (error.response) {
        setError(error.response.data.message || "Invalid credentials");
      } else {
        setError("Network error. Please try again.");
      }
    }
  };



  return (
    <div className='min-h-screen w-full bg-gray-900 flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 sm:p-8'>
        <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500'>
          Welcome Back
        </h1>

        {error && (
          <div className='mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm'>
            {error}
          </div>
        )}

        <form onSubmit={submitHandle} className='space-y-5'>
          <div>
            <label className='block text-sm sm:text-base font-medium text-gray-300 mb-2'>
              Email
            </label>
            <input
              name='email'
              value={data.email}
              onChange={onChangeHandle}
              className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500'
              type="email"
              placeholder='Enter your email'
              required
            />
          </div>

          <div>
            <label className='block text-sm sm:text-base font-medium text-gray-300 mb-2'>
              Password
            </label>
            <input
              name='password'
              value={data.password}
              onChange={onChangeHandle}
              className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500'
              type="password"
              placeholder='Enter password'
              required
            />
          </div>

          <button
            type='submit'
            className='w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md'
          >
            Log In
          </button>
        </form>

        <p className='mt-6 text-center text-sm text-gray-400'>
          Don't have an account?{' '}
          <Link
            to="/signup"
            className='text-cyan-400 hover:text-cyan-300 font-medium'
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
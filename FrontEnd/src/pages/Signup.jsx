import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { set_emp_data } from '../store/slices/UserSlice';
import { set_token } from '../store/slices/TokenSlice';

const Signup = () => {
  const [data, setData] = useState({
    fullname: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onChangeHandle = (e) => {
    const { value, name } = e.target;
    setData({
      ...data,
      [name]: value
    });
  };

  const submitHandle = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/signup`, data);
      const { user, userData, token } = result.data;

      dispatch(set_emp_data({ user, userData }));
      dispatch(set_token(token));
      localStorage.setItem("token", token);
      navigate("/");

      setData({
        fullname: '',
        email: '',
        password: '',
      });
    } catch (err) {
      console.log(err);
    }
  };



  return (
    <div className='min-h-screen w-full bg-gray-900 flex items-center justify-center p-4'>
      <div className='w-full max-w-md bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 sm:p-8'>
        <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500'>
          Create Account
        </h1>

        <form onSubmit={submitHandle} className='space-y-5'>
          <div>
            <label className='block text-sm sm:text-base font-medium text-gray-300 mb-2'>
              Full Name
            </label>
            <input
              name='fullname'
              value={data.fullname}
              onChange={onChangeHandle}
              className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500'
              type="text"
              placeholder='Enter your name'
              required
            />
          </div>

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
              placeholder='Create password'
              required
            />
          </div>

          <button
            type='submit'
            className='w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md'
          >
            Sign Up
          </button>
        </form>

        <p className='mt-6 text-center text-sm text-gray-400'>
          Already have an account?{' '}
          <a
            href="/login"
            className='text-cyan-400 hover:text-cyan-300 font-medium'
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
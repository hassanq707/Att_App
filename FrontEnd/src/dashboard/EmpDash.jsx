import React, { useEffect, useState } from 'react'
import Header from '../others/Header';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { set_att_info, set_emp_data } from '../store/slices/UserSlice'
import axios from 'axios';
import { set_token } from '../store/slices/TokenSlice';

const EmpDash = () => {

  const { emp_data } = useSelector((state) => state.data);


  const { token } = useSelector(data => data.auth)

  const [isAuthorized, setIsAuthorized] = useState(false);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  async function fetchUserData() {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/employee`, {
        headers: { token }
      })
      const { user, data } = response.data;
      dispatch(set_emp_data(user))
      dispatch(set_att_info(data))
      setIsAuthorized(true)
    }
    catch (err) {
      if (err.response && err.response.status === 401) {
        if (err.response.data.message == "Unauthorized") {
          return navigate('/admin')
        }
      }
      setIsAuthorized(false)
      return navigate("/login")
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) return navigate("/login");
    dispatch(set_token(storedToken));
  }, []);

  useEffect(() => {
    if (token) fetchUserData();
  }, [token]);



  if (!isAuthorized) return <div className="text-white text-center mt-10">Loading...</div>;


  return (
    <>
      <div className="box-border min-h-screen w-full bg-gray-900">
        <Header name={emp_data.fullname} />
        <Outlet />
      </div>
    </>
  )
}

export default EmpDash
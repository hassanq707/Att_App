import React, { useEffect, useState } from 'react'
import axios from "axios"
import Header from '../others/Header'
import { Outlet, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { set_all_emp_data } from '../store/slices/UserSlice'
import { set_token } from '../store/slices/TokenSlice'

const AdminDash = () => {

    const { token } = useSelector(data => data.auth)

    const [admin, setAdmin] = useState("")
    const [isAuthorized, setIsAuthorized] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch()

    async function fetchUserData() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/allUsers`, { headers: { token } })
            const { allUsers, admin } = response.data
            dispatch(set_all_emp_data(allUsers))
            setAdmin(admin.fullname)
            setIsAuthorized(true)
        }
        catch (err) {
            console.log(err)
            if (err.response && err.response.status === 401) {
                alert("You are Unauthorized to access this page");
                navigate("/")
            }
            setIsAuthorized(false);
        }
    }

    useEffect(() => {
        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
            return navigate("/login");
        }

        dispatch(set_token(storedToken));
        fetchUserData();
    }, []);

    if (!isAuthorized) return <div className="text-white text-center mt-10">Loading...</div>;

    return (
        <div className="bg-[#031114] h-screen">
            <Header name={admin + ' (Admin)'} />
            <Outlet />
        </div>
    )
}

export default AdminDash;

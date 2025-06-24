import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmpDash from "./dashboard/EmpDash";
import AdminDash from "./dashboard/AdminDash";
import Leave from "./empCompo/Leave";
import Attendance from "./empCompo/Attendance";
import Req_Attendance from "./adminCompo/Req_Attendance";
import Emp_Status from "./adminCompo/Emp_Status";
import WorkStatus from "./empCompo/WorkStatus";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EmpDash />}>
          <Route index element={<Attendance />} />
          <Route path="leave" element={<Leave />} />
          <Route path="status" element={<WorkStatus />} />
        </Route>
        <Route path="/admin" element={<AdminDash />}>
          <Route index element={<Req_Attendance />} />
          <Route path="Emp_Status" element={<Emp_Status />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
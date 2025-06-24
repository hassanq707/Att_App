import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EmpDash from "./dashboard/EmpDash";
import AdminDash from "./dashboard/AdminDash";
import Leave from "./empCompo/Leave";
import Attendance from "./empCompo/Attendance";
import Req_Attendance from "./adminCompo/Req_Attendance";
import Emp_Status from "./adminCompo/Emp_Status";
import WorkStatus from "./empCompo/WorkStatus";

const router = createBrowserRouter([
  {
    path: "/",
    element: <EmpDash />,
    children: [
      {
        index: true,
        element: <Attendance />
      },
      {
        path: "leave",
        element: <Leave />
      },
      {
        path: "status",
        element: <WorkStatus />
      }
    ]
  },
  {
    path: "/admin",
    element: <AdminDash />,
    children: [
      {
        index: true,
        element: <Req_Attendance />
      },
      {
        path: "Emp_Status",
        element: <Emp_Status />
      }
    ]
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
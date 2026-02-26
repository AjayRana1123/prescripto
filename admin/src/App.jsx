import React, { useContext } from 'react'
import Login from './pages/Login'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdminContext } from './context/AdminContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';

const App = () => {

  const { aToken } = useContext(AdminContext)

  return aToken ? (
    <div className="h-screen flex flex-col bg-[#F8F9FD] overflow-hidden">
      
      <ToastContainer />
      
      {/* Navbar fixed at top */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar */}
        <Sidebar />

        {/* Page Content (Scrollable Area) */}
        <div className="flex-1 overflow-y-auto p-4">
          <Routes>
            <Route path="/" element={<></>} />
            <Route path="/admin-dashboard" element={<Dashboard />} />
            <Route path="/all-appointments" element={<AllAppointments />} />
            <Route path="/add-doctor" element={<AddDoctor />} />
            <Route path="/doctors-list" element={<DoctorsList />} />
          </Routes>
        </div>

      </div>
    </div>
  ) : (
    <>
      <Login />
      <ToastContainer />
    </>
  )
}
export default App
import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

const [aToken,setAToken] = useState(localStorage.getItem("aToken") || "");
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);

  // ---------------- GET ALL DOCTORS ----------------

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/all-doctors",
        {},
        { headers: { aToken } }
      );

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ---------------- CHANGE DOCTOR AVAILABILITY ----------------

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { docId },
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ---------------- GET ALL APPOINTMENTS ----------------

  const getAllAppointments = async () => {
    try {

      const { data } = await axios.get(
        backendUrl + "/api/admin/appointments",
        { headers: { aToken } }
      );

      console.log("API RESPONSE:", data);

      if (data.success) {
        setAppointments(data.appointments);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // ---------------- CANCEL APPOINTMENT ----------------

 const cancelAppointment = async (appointmentId, reason) => {

  try {

    const { data } = await axios.post(
      backendUrl + "/api/admin/cancel-appointment",
      { appointmentId, reason },
      { headers: { aToken } }
    )

    if (data.success) {

      toast.success(data.message)

      getAllAppointments()

    } else {

      toast.error(data.message)

    }

  } catch (error) {

    toast.error(error.message)

  }

}
  // ---------------- DASHBOARD DATA ----------------

  const getdashData = async () => {
    try {

      const { data } = await axios.get(
        backendUrl + "/api/admin/dashboard",
        { headers: { aToken } }
      );

      if (data.success) {
        setDashData(data.dashData);
        console.log(data.dashData);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  // ---------------- CONTEXT VALUE ----------------

  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    dashData,
    getdashData
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
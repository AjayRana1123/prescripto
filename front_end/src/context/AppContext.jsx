import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {

  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // -------- STATES --------

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userData, setUserData] = useState(false);

  // -------- GET DOCTORS --------

  const getDoctorsData = async () => {
    try {

      const { data } = await axios.get(backendUrl + "/api/doctor/list");

      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // -------- LOAD USER DATA --------

  const loadUserData = async () => {
    try {

      const { data } = await axios.get(
        backendUrl + "/api/user/get-profile",
        { headers: { token } }
      );

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // -------- GET USER APPOINTMENTS --------

  const getUserAppointments = async () => {
    try {

      const { data } = await axios.get(
        backendUrl + "/api/user/appointments",
        { headers: { token } }
      );

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

  // -------- CANCEL APPOINTMENT (WITH REASON) --------

  const cancelAppointment = async (appointmentId, reason) => {

    try {

      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId, reason },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // -------- CONTEXT VALUE --------

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    loadUserData,
    userData,
    setUserData,
    appointments,
    getUserAppointments,
    cancelAppointment
  };

  // -------- EFFECTS --------

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserData();
      getUserAppointments();
    } else {
      setUserData(false);
    }
  }, [token]);

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
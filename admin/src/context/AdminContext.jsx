import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  // Get backend URL from environment variable or use a fallback
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  
  // Add axios interceptor to handle network errors globally
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.message === 'Network Error') {
          toast.error('Cannot connect to backend server. Please ensure the server is running.');
        }
        return Promise.reject(error);
      }
    );
    
    return () => axios.interceptors.response.eject(interceptor);
  }, []);
  
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );

  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState([]);

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/all-doctors", {
        headers: { 
          atoken: aToken,
          Authorization: `Bearer ${aToken}`
        },
      });
      if (data.success) {
        console.log("data:", data);
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      if (error.code === "ERR_NETWORK") {
        toast.error("Cannot connect to backend server. Please ensure the server is running.");
      } else if (error.response) {
        toast.error(error.response.data?.message || "Error fetching doctors");
      } else {
        toast.error("An error occurred while fetching doctors");
      }
    }
  };

  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/change-availability",
        { docId },
        { headers: { 
          atoken: aToken,
          Authorization: `Bearer ${aToken}`
        } }
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      if (error.code === "ERR_NETWORK") {
        toast.error("Cannot connect to backend server. Please ensure the server is running.");
      } else if (error.response) {
        toast.error(error.response.data?.message || "Error changing doctor availability");
      } else {
        toast.error("An error occurred while changing doctor availability");
      }
    }
  };

  const getAllAppointments = async () => {
    console.log("getAllAppointments:");
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/appointments", {
        headers: { 
          atoken: aToken,
          Authorization: `Bearer ${aToken}`
        },
      });
      if (data.success) {
        setAppointments(data.appointments);
        console.log("data.appointments:", data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      if (error.code === "ERR_NETWORK") {
        toast.error("Cannot connect to backend server. Please ensure the server is running.");
      } else if (error.response) {
        toast.error(error.response.data?.message || "Error fetching appointments");
      } else {
        toast.error("An error occurred while fetching appointments");
      }
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/admin/cancel-appointment",
        { appointmentId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
        getDashData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      if (error.code === "ERR_NETWORK") {
        toast.error("Cannot connect to backend server. Please ensure the server is running.");
      } else if (error.response) {
        toast.error(error.response.data?.message || "Error cancelling appointment");
      } else {
        toast.error("An error occurred while cancelling the appointment");
      }
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/admin/dashboard", {
        headers: { aToken },
      });
      if (data.success) {
        console.log("data:", data);
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      if (error.code === "ERR_NETWORK") {
        toast.error("Cannot connect to backend server. Please ensure the server is running.");
      } else if (error.response) {
        toast.error(error.response.data?.message || "Error fetching dashboard data");
      } else {
        toast.error("An error occurred while fetching dashboard data");
      }
    }
  };
  
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
    getDashData,
    dashData,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;

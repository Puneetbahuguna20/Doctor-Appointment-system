import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  // Get backend URL from environment variable or use a fallback
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
  
  // Add axios interceptor to handle network errors for doctor-specific requests
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.message === 'Network Error' && error.config?.url?.includes('/api/doctor')) {
          toast.error('Cannot connect to doctor backend services. Please ensure the server is running.');
        }
        return Promise.reject(error);
      }
    );
    
    return () => axios.interceptors.response.eject(interceptor);
  }, []);
  const [dToken, setDToken] = useState(
    localStorage.getItem("dToken") ? localStorage.getItem("dToken") : ""
  );
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState([]);
  const [profileData, setProfileData] = useState(false);

  const getAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/doctor/appointments",
        {
          headers: { dToken },
        }
      );
      if (data.success) {
        setAppointments(data.appointments.reverse());
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

  const completeAppointment = async (appointmentId) => {
    console.log("appointmentId:", appointmentId);
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/complete-appointment",
        { appointmentId },
        { headers: { dToken } }
      );
      console.log("data:", data);
      if (data.success) {
        console.log("data:", data);
        getAppointments();

        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      if (error.code === "ERR_NETWORK") {
        toast.error("Cannot connect to backend server. Please ensure the server is running.");
      } else if (error.response) {
        toast.error(error.response.data?.message || "Error completing appointment");
      } else {
        toast.error("An error occurred while completing the appointment");
      }
    }
  };
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/cancel-appointment",
        { appointmentId },
        { headers: { dToken } }
      );
      if (data.success) {
        getAppointments();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      if (error.code === "ERR_NETWORK") {
        toast.error("Cannot connect to backend server. Please ensure the server is running.");
      } else if (error.response) {
        toast.error(error.response.data?.message || "Error canceling appointment");
      } else {
        toast.error("An error occurred while canceling the appointment");
      }
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/dashboard", {
        headers: { dToken },
      });
      if (data.success) {
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

  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/profile", {
        headers: { dToken },
      });
      if (data.success) {
        setProfileData(data.profileData);
        console.log("data:", data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      if (error.code === "ERR_NETWORK") {
        toast.error("Cannot connect to backend server. Please ensure the server is running.");
      } else if (error.response) {
        toast.error(error.response.data?.message || "Error fetching profile data");
      } else {
        toast.error("An error occurred while fetching profile data");
      }
    }
  };

  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
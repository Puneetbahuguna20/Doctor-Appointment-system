import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );
  const [userData, setUserData] = useState(false);

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");
      if (data.success) {
        setDoctors(data.doctors);
      }
    } catch (error) {
      console.log("No Doctor is fetched from backend");
      console.log("error:", error);
      if (error.code === "ERR_NETWORK") {
        toast.error("Cannot connect to backend server. Please ensure the server is running.");
      } else if (error.response) {
        toast.error(error.response.data?.message || "Failed to fetch doctors list");
      } else {
        toast.error("An error occurred while fetching doctors");
      }
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { token },
      });
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("error:", error);
      if (error.code === "ERR_NETWORK") {
        toast.error("Cannot connect to backend server. Please ensure the server is running.");
      } else if (error.response) {
        toast.error(error.response.data?.message || "Failed to load user profile");
      } else {
        toast.error("An error occurred while loading your profile");
      }
    }
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(
        backendUrl + "/api/user/appointments",
        {
          headers: { token },
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
        toast.error(error.response.data?.message || "Failed to fetch your appointments");
      } else {
        toast.error("An error occurred while fetching your appointments");
      }
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  useEffect(() => {
    // request interceptor
    axios.interceptors.request.use(
      (config) => {
        setIsLoading(true);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // response interceptor
    axios.interceptors.response.use(
      (config) => {
        setIsLoading(false);
        return config;
      },
      (error) => {
        setIsLoading(false);
        if (error.message === "Network Error") {
          console.log("Network error detected in interceptor");
        }
        return Promise.reject(error);
      }
    );
  }, []);

  const value = {
    currencySymbol,
    backendUrl,
    isLoading,
    setIsLoading,
    token,
    setToken,
    userData,
    setUserData,
    loadUserProfileData,
    doctors,
    setDoctors,
    getDoctorsData,
    appointments,
    setAppointments,
    getUserAppointments,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;

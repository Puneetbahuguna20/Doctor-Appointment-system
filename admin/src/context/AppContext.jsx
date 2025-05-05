import { useState, useEffect } from "react";
import { createContext } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currency = "$";
  const [isLoading, setIsLoading] = useState(false);
  console.log("isLoading:", isLoading);

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    const age = today.getFullYear() - birthDate.getFullYear();
    return age;
  };

  const months = [
    "",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    // Request interceptor
    const requestInterceptor = axios.interceptors.request.use(
        (config) => {
            const apiKey = localStorage.getItem("api_key"); // or from context/state
            if (apiKey) {
              config.headers['x-api-key'] = apiKey;
            }
            setIsLoading(true);
            return config;
          },
          (error) => {
            return Promise.reject(error);
          }
    );

    // Response interceptor
    const responseInterceptor = axios.interceptors.response.use(
      (config) => {
        setIsLoading(false);
        return config;
      },
      (error) => {
        setIsLoading(false); // Reset loading state on error as well
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on component unmount
    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const slotDateFormat = (slotDate) => {
    if (!slotDate || !slotDate.includes("_")) {
      return "Invalid date format"; // Handle invalid format
    }
    const dataArray = slotDate.split("_");
    const month = months[Number(dataArray[1])] || "Invalid month";
    return `${dataArray[0]} ${month} ${dataArray[2]}`;
  };

  const value = {
    calculateAge,
    slotDateFormat,
    currency,
    isLoading,
    setIsLoading,
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};

export default AppContextProvider;

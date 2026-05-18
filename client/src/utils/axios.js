import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://sirius-g2po.onrender.com/api/v1",
  withCredentials: true
})

axiosInstance.interceptors.request.use((config) => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}) 

export default axiosInstance;
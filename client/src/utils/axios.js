import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://sirius-g2po.onrender.com/api/v1",
  withCredentials: true
})

export default axiosInstance;
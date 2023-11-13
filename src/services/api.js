import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use(function (config) {
  const token = localStorage.getItem("token");

  config.headers.Authorization = token;

  return config;
});

export default api;

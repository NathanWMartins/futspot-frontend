import axios from "axios";

//import.meta.env.VITE_API_URL ||
export const api = axios.create({
    baseURL: "http://localhost:3000",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(import.meta.env.VITE_LS_TOKEN);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
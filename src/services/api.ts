import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

const LS_TOKEN = "futspot_token";

api.interceptors.request.use((config) => {
    const token = localStorage.getItem(LS_TOKEN);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
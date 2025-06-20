import axios from "axios";
import { useAuthStore } from "../store/Auth";

const BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    }
});

api.interceptors.request.use(config => {
    const { accessToken } = useAuthStore.getState().state;
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

export { api };

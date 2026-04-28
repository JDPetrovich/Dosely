import axios from "axios";
import { TokenStore } from "./tokenStore.js";

const api = axios.create({
    baseURL: process.env.API_KEY,
    headers: {
        "Content-Type": "application/json",
    }
});

api.interceptors.request.use((config) => {
    const token = TokenStore.getAccess();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            try {
                const refreshToken = TokenStore.getRefresh();

                const res = await axios.post(
                    `${process.env.API_KEY}/refresh`,
                    { refreshToken }
                );

                const {
                    accessToken: newAccess,
                    refreshToken: newRefresh
                } = res.data.dados;

                TokenStore.set(newAccess, newRefresh);

                original.headers.Authorization = `Bearer ${newAccess}`;

                return api(original);

            } catch {
                TokenStore.clear();
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export async function apiFetch(path: string, options: any = {}) {
    const res = await api({
        url: path,
        method: options.method || "GET",
        data: options.body ?? undefined
    });

    return res.data;
}
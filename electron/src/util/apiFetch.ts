import axios from "axios";
import { TokenStore } from "./tokenStore.js";

const api = axios.create({
    baseURL: process.env.API_KEY,
    headers: {
        "Content-Type": "application/json",
    }
});

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    isRefreshing = false;
    failedQueue = [];
};

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
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        original.headers.Authorization = `Bearer ${token}`;
                        return api(original);
                    })
                    .catch(err => Promise.reject(err));
            }

            original._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = TokenStore.getRefresh();

                if (!refreshToken) {
                    TokenStore.clear();
                    processQueue(new Error("Sem refresh token"), null);
                    return Promise.reject(error);
                }


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

                processQueue(null, newAccess);

                return api(original);

            } catch (err) {
                TokenStore.clear();
                processQueue(err, null);
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
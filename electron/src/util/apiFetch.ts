import axios from "axios";
import { CookieJar } from "tough-cookie";
import { wrapper } from "axios-cookiejar-support";

const jar = new CookieJar();

const API_KEY = process.env.API_KEY
const KEY = process.env.KEY

const api = wrapper(axios.create({
    baseURL: API_KEY,
    jar,
    withCredentials: true,
    headers: {
        "x-api-key": KEY,
    }
}));

export async function apiFetch(path: string, options: any = {}) {
    try {
        const res = await api({
            url: path,
            method: options.method || "GET",
            data: options.body ?? undefined
        });

        return res.data;
    } catch (error: any) {
        return {
            sucesso: false,
            mensagem: error.response?.data?.mensagem || error.message,
        };
    }
}
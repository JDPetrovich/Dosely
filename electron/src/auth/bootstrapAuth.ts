import { apiFetch } from "../util/apiFetch.js";
import { TokenStore } from "../util/tokenStore.js";

export async function bootstrapAuth() {
    const hasSession = TokenStore.restore();

    if (!hasSession) return false;

    const refreshToken = TokenStore.getRefresh();

    if (!refreshToken) return false;

    try {
        const res = await apiFetch("/refresh", {
            method: "POST",
            body: JSON.stringify({ refreshToken }),
        });

        const { accessToken, refreshToken: newRefresh } = res.dados;

        TokenStore.set(accessToken, newRefresh);

        return true;
    } catch {
        TokenStore.clear();
        return false;
    }
}
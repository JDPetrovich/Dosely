import { apiFetch } from "../util/apiFetch.js";
import { TokenStore } from "../util/tokenStore.js";

export async function bootstrapAuth() {
    if (!TokenStore.restore()) {
        return false;
    }

    return refreshTokens();
}

export async function refreshTokens() {
    const refreshToken = TokenStore.getRefresh();

    if (!refreshToken) {
        return false;
    }

    try {
        const res = await apiFetch("/refresh", {
            method: "POST",
            body: { refreshToken },
        });

        if (!res.sucesso) {
            TokenStore.clear();
            return false;
        }

        const { accessToken, refreshToken: newRefresh } = res.dados;

        if (!accessToken || !newRefresh) {
            TokenStore.clear();
            return false;
        }

        TokenStore.set(accessToken, newRefresh);
        return true;
    } catch {
        TokenStore.clear();
        return false;
    }
}
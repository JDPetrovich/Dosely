import { TokenStore } from "../util/tokenStore.js";
import { apiFetch } from "../util/apiFetch.js";

export class AuthService {

    async logout() {
        const refreshToken = TokenStore.getRefresh();

        if (refreshToken) {
            await apiFetch("/logout", {
                method: "POST",
                body: JSON.stringify({ refreshToken }),
            });
        }

        TokenStore.clear();
    }

    async getAccessToken() {
        return TokenStore.getAccess();
    }
}
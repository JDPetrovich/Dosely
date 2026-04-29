import { safeStorage } from "electron";
import fs from "fs";
import path from "path";
import { app } from "electron";

const FILE_PATH = path.join(app.getPath("userData"), "session.bin");

let accessToken: string | null = null;
let refreshToken: string | null = null;

function persist() {

    if (!safeStorage.isEncryptionAvailable()) {
        return;
    }

    if (!accessToken || !refreshToken) {
        if (fs.existsSync(FILE_PATH)) {
            fs.unlinkSync(FILE_PATH);
        }
        return;
    }

    try {
        const payload = JSON.stringify({
            accessToken,
            refreshToken,
        });


        const encrypted = safeStorage.encryptString(payload);

        fs.writeFileSync(FILE_PATH, encrypted);
    } catch (error) {
        console.error("❌ [TokenStore.persist] Erro ao persistir:", error);
    }
}

export const TokenStore = {
    set(access: string | null, refresh: string | null) {

        accessToken = access;
        refreshToken = refresh;


        persist();
    },

    getAccess() {
        return accessToken;
    },

    getRefresh() {
        return refreshToken;
    },

    clear() {
        accessToken = null;
        refreshToken = null;

        if (fs.existsSync(FILE_PATH)) {
            fs.unlinkSync(FILE_PATH);
        }
    },

    restore(): boolean {

        if (!safeStorage.isEncryptionAvailable()) {
            return false;
        }

        if (!fs.existsSync(FILE_PATH)) {
            return false;
        }

        try {
            const encrypted = fs.readFileSync(FILE_PATH);

            const decrypted = safeStorage.decryptString(encrypted);

            const data = JSON.parse(decrypted);

            if (!data?.accessToken || !data?.refreshToken) {
                this.clear();
                return false;
            }

            accessToken = data.accessToken;
            refreshToken = data.refreshToken;

            return true;
        } catch (err) {
            this.clear();
            return false;
        }
    }
};
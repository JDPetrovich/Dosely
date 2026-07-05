import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;
const REFRESH_SECRET = process.env.REFRESH_SECRET as string;

export class TokenService {

    gerarAccessToken(payload: object) {
        return jwt.sign(payload, JWT_SECRET, {
            expiresIn: "15m",
        });
    }

    gerarRefreshToken(payload: object) {
        const expiresIn = 7 * 24 * 60 * 60;

        const token = jwt.sign(payload, REFRESH_SECRET, {
            expiresIn: "7d",
        });

        return {
            token,
            expiraEm: Math.floor(Date.now() / 1000) + expiresIn,
        };
    }

    verificarAccessToken(token: string) {
        return jwt.verify(token, JWT_SECRET, {
            algorithms: ["HS256"],
        });
    }

    verificarRefreshToken(token: string) {
        return jwt.verify(token, REFRESH_SECRET, {
            algorithms: ["HS256"],
        });
    }
}
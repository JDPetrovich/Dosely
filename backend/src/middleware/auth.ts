import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

interface IJwtPayload extends JwtPayload {
    id: number;
    nome: string;
}

declare module "express-serve-static-core" {
    interface Request {
        usuario?: IJwtPayload;
    }
}

function isJwtPayload(val: any): val is IJwtPayload {
    return (
        typeof val === "object" &&
        val !== null &&
        typeof val.id === "number" &&
        typeof val.nome === "string"
    );
}

export function verificarAuth(req: Request, res: Response, next: NextFunction) {
    let authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.sendStatus(401);
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            algorithms: ["HS256"],
        });

        if (!isJwtPayload(decoded)) {
            return res.status(401).json({
                sucesso: false,
                mensagem: "Token inválido",
            });
        }

        req.usuario = decoded;
        next();
    } catch (error: any) {
        return res.status(401).json({
            sucesso: false,
            mensagem:
                error.name === "TokenExpiredError"
                    ? "Token expirado"
                    : "Token inválido",
        });
    }
}
import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    limit: 5,

    message: {
        mensagem: "Muitas tentativas de login. Por favor, tente novamente mais tarde.",
    },

    standardHeaders: true,
    legacyHeaders: false,

    identifier: (req) => {
        const login = req.body?.login?.toLowerCase().trim();
        return login ?? req.ip;
    },
});
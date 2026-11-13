# Implementar autenticação/autorização

- Usar middleware de autenticação em todas as rotas protegidas
- Validar JWT (assinatura + expiração) em toda request protegida
- Extrair id e role do JWT e anexar em req.user
- Não aceitar identidade/permissão de body, params ou headers customizados
- Usar camada separada de autorização (role check) por rota
- Bloquear com 403 quando role não for permitido
- Aplicar auth + role check em todas as rotas sensíveis
- Frontend não participa de decisão de permissão

---

# Referência de implementação

## Middleware de autenticação

```ts
import jwt from "jsonwebtoken";

export function auth(req, res, next) {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.sendStatus(401);
    }

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (err) {
        return res.sendStatus(401);
    }
}
```

## Middleware de autorização (role check)

```ts
export function requireRole(role) {
    return (req, res, next) => {
        if (!req.user || req.user.role !== role) {
            return res.sendStatus(403);
        }

        next();
    };
}
```

## Exemplo de rota protegida

```ts
import express from "express";
import { auth } from "./middlewares/auth";
import { requireRole } from "./middlewares/requireRole";

const router = express.Router();

router.get("/admin/pacientes",auth,requireRole("admin"),
    (req, res) => {
        return res.json({
            mensagem: "Acesso autorizado ao painel admin"
        });
    }
);

export default router;
```

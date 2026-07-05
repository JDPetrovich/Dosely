import { Router } from "express";
import { limiter } from "../util/limiter.js";

import { usuarioController } from "../controller/usuario/usuario.controller.js";
import { verificarAuth } from "../middleware/auth.js";

const router = Router();

router.get("/me", verificarAuth, usuarioController.me);

router.post("/login", limiter, usuarioController.login);
router.post("/usuario", usuarioController.criar);

export default router;
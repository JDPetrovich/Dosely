import { Router } from "express";
import { limiter } from "../util/limiter.js";
import { UsuarioController } from "../controller/usuario/usuario.controller.js";

const usuarioController = new UsuarioController();
const router = Router();

router.post("/login", limiter, usuarioController.login);
router.post("/usuario", usuarioController.criarUsuario);

export default router;
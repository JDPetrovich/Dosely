import { Router } from "express";
import { pacienteController } from "../controller/paciente/paciente.controller.js";
import { verificarAuth } from "../middleware/auth.js";

const router = Router();

router.use(verificarAuth);

router.get("/pacientes", pacienteController.buscarTodos);
router.post("/paciente", pacienteController.criar);
router.put("/paciente/:id", pacienteController.atualizar);
router.delete("/paciente/:id", pacienteController.deletar);

export default router;
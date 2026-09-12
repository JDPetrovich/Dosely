import { Router } from "express";
import { PacienteController } from "../controller/paciente/paciente.controller.js";

const pacienteController = new PacienteController();
const router = Router();

router.get("/pacientes", pacienteController.buscarTodosPacientes);
router.post("/paciente", pacienteController.criarPaciente);
router.put("/paciente/:id", pacienteController.atualizarPaciente);
router.delete("/paciente/:id", pacienteController.deletarPaciente);

export default router;
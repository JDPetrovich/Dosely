import { Router } from "express";
import { verificarAuth } from "../middleware/auth.js";
import { medicamentoController } from "../controller/medicamento/medicamento.controller.js";
import { medicamentoPacienteController } from "../controller/medicamento/medicamento-paciente.controller.js";

const router = Router();

router.use(verificarAuth);

router.get("/medicamentos", medicamentoController.buscarTodos);
/* router.post("/medicamento", medicamentoController.criar);
router.put("/medicamento/:id", medicamentoController.atualizar);
router.delete("/medicamento/:id", medicamentoController.deletar); */

router.get("/medicamentos/paciente/:id", medicamentoPacienteController.buscarTodos);

export default router;
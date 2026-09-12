import { Router } from "express";
import { MedicamentoController } from "../controller/medicamento/medicamento.controller.js";
import { TratamentoController } from "../controller/medicamento/tratamento.controller.js";

const medicamentoController = new MedicamentoController();
const medicamentoPacienteController = new TratamentoController();
const router = Router();

router.get("/medicamentos", medicamentoController.buscarMedicamentos);
router.post("/medicamento", medicamentoController.criarMedicamento);
router.put("/medicamento/:id", medicamentoController.atualizarMedicamento);
router.delete("/medicamento/:id", medicamentoController.deletarMedicamento);

router.post("/paciente/:id/medicamento/:id", medicamentoPacienteController.criarTratamento);
router.put("/paciente/:id/medicamento/:id", medicamentoPacienteController.atualizarTratamento);
router.delete("/paciente/:id/medicamento/:id", medicamentoPacienteController.deletarTratamento);

export default router;
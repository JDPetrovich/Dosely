import { Router } from "express";
import { MedicamentoController } from "../controller/medicamento/medicamento.controller.js";

const medicamentoController = new MedicamentoController();
const router = Router();

router.get("/medicamentos", medicamentoController.buscarMedicamentos);
router.post("/medicamento", medicamentoController.criarMedicamento);
router.put("/medicamento/:seqmedicamento", medicamentoController.atualizarMedicamento);
router.delete("/medicamento/:seqmedicamento", medicamentoController.deletarMedicamento);
export default router;
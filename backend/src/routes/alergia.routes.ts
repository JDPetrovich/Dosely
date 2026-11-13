import { Router } from "express";
import { AlergiaController } from "../controller/alergia/alergia.controller.js";
import { AlergiaPacienteController } from "../controller/alergia/alergia-paciente.controller.js";

const alergiaController = new AlergiaController();
const alergiaPacienteController = new AlergiaPacienteController();
const router = Router();

router.get("/alergias", alergiaController.buscarTodos);
router.post("/alergia", alergiaController.criar);
router.put("/alergia/:seqalergia", alergiaController.atualizar);
router.delete("/alergia/:seqalergia", alergiaController.deletar);

router.get("/alergias/paciente/:seqpaciente", alergiaPacienteController.buscarTodos);
router.post("/alergias/paciente/:seqpaciente", alergiaPacienteController.associar);
router.delete("/alergias/paciente/:seqpaciente/:seqalergia", alergiaPacienteController.desassociar);

export default router;
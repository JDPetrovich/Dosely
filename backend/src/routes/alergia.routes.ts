import { Router } from "express";
import { AlergiaController } from "../controller/alergia/alergia.controller.js";
import { AlergiaPacienteController } from "../controller/alergia/alergia-paciente.controller.js";
import { verificarAuth } from "../middleware/auth.js";

const alergiaController = new AlergiaController();
const alergiaPacienteController = new AlergiaPacienteController();
const router = Router();

router.get("/alergias", alergiaController.buscarTodos);
/* router.post("/alergia", alergiaController.criar);
router.put("/alergia/:id", alergiaController.atualizar);
router.delete("/alergia/:id", alergiaController.deletar); */

router.get("/alergias/paciente/:id", alergiaPacienteController.buscarTodos);
/* router.post("/alergia/paciente/:id", alergiaPacienteController.criar);
router.put("/alergia/paciente/:id", alergiaPacienteController.atualizar);
router.delete("/alergia/paciente/:id", alergiaPacienteController.deletar); */

export default router;
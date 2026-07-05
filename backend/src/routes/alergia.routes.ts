import { Router } from "express";
import { alergiaController } from "../controller/alergia/alergia.controller.js";
import { alergiaPacienteController } from "../controller/alergia/alergia-paciente.controller.js";
import { verificarAuth } from "../middleware/auth.js";
const router = Router();

router.use(verificarAuth);

router.get("/alergias", alergiaController.buscarTodos);
/* router.post("/alergia", alergiaController.criar);
router.put("/alergia/:id", alergiaController.atualizar);
router.delete("/alergia/:id", alergiaController.deletar); */

router.get("/alergias/paciente/:id", alergiaPacienteController.buscarTodos);
/* router.post("/alergia/paciente/:id", alergiaPacienteController.criar);
router.put("/alergia/paciente/:id", alergiaPacienteController.atualizar);
router.delete("/alergia/paciente/:id", alergiaPacienteController.deletar); */

export default router;
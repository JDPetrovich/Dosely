import { Router } from "express";
import { PacienteController } from "../controller/paciente/paciente.controller.js";
import { TratamentoController } from "../controller/tratamento/tratamento.controller.js";

const pacienteController = new PacienteController();
const tratamentoController = new TratamentoController();
const router = Router();

router.get("/pacientes", pacienteController.buscarTodosPacientes);
router.post("/paciente", pacienteController.criarPaciente);
router.put("/paciente/:seqpaciente", pacienteController.atualizarPaciente);
router.delete("/paciente/:seqpaciente", pacienteController.deletarPaciente);

router.get("/paciente/:seqpaciente/tratamentos", tratamentoController.buscarTratamento);
router.post("/paciente/:seqpaciente/tratamento", tratamentoController.criarTratamento);
router.put("/paciente/:seqpaciente/tratamento/:seqtratamento", tratamentoController.atualizarTratamento);
router.delete("/paciente/:seqpaciente/tratamento/:seqtratamento", tratamentoController.deletarTratamento);


export default router;
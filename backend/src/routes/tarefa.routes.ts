import { Router } from "express";
import { TarefaController } from "../controller/tarefa/tarefa.controller.js";
import { verificarAuth } from "../middleware/auth.js";

const tarefaController = new TarefaController();
const router = Router();

router.get("/tarefas", tarefaController.buscarTodos);
router.post("/tarefa", tarefaController.criar);
router.put("/tarefa/:id", tarefaController.atualizar);
router.patch("/tarefa/:id", tarefaController.concluir);

export default router;
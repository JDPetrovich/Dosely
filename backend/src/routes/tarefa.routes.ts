import { Router } from "express";
import { tarefaController } from "../controller/tarefa/tarefa.controller.js";
import { verificarAuth } from "../middleware/auth.js";
const router = Router();

router.use(verificarAuth);

router.get("/tarefas", tarefaController.buscarTodos);
router.post("/tarefa", tarefaController.criar);
router.put("/tarefa/:id", tarefaController.atualizar);
router.patch("/tarefa/:id", tarefaController.concluir);

export default router;
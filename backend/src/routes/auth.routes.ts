import { Router } from "express";
import { AuthController } from "../controller/auth/auth.controller.js";
import { verificarAuth } from "../middleware/auth.js";

const authController = new AuthController();
const router = Router();

router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

router.get("/me", verificarAuth, authController.me);
export default router;
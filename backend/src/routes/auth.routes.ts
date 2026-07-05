import { Router } from "express";
import { authController } from "../controller/auth/auth.controller.js";

const router = Router();

router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);

export default router;
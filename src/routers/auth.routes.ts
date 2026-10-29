import { Router } from "express";

import {
  register,
  login,
  actualizarPerfil,
} from "../controllers/auth.controller.js";

import { verifyToken } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";
import { uploadFotoPerfil } from "../middlewares/upload-foto.middleware";

const router: Router = Router();

router.post("/register", verifyToken, authorize("GERENCIA"), register);

router.post("/login", login);

router.put("/perfil", verifyToken, uploadFotoPerfil, actualizarPerfil);

export default router;

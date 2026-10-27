import { Router } from "express";
import { getMedicos } from "../controllers/medico.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router: Router = Router();

// Listado disponible para usuarios autenticados.
router.get("/", verifyToken, getMedicos);

router.get(
  "/ESPECIALIDADES",
  verifyToken,
  authorize("RECEPCIONISTA"),
  getMedicos,
  /* #swagger.security = [{
    "bearerAuth": []
  }] */
);

export default router;

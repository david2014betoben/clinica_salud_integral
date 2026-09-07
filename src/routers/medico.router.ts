import { Router } from "express";
import {
  getMedicos,
  postMedico,
  putMedico,
  deleteMedico,
} from "../controllers/medico.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router: Router = Router();

router.get(
  "/ESPECIALIDADES",
  verifyToken,
  authorize("RECEPCIONISTA"),
  getMedicos /* #swagger.security = [{
            "bearerAuth": []
    }] */,
);

export default router;

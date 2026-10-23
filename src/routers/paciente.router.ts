import { Router } from "express";
import {
  getPacientes,
  getPacienteById,
  postPaciente,
  putPaciente,
  deletePaciente,
} from "../controllers/paciente.controller";
import { pacienteSchema } from "../schemas/validate-paciente";
import { validate } from "../middlewares/validate";
import { verifyToken } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router: Router = Router();

router.get("/", getPacientes);
router.get(
  "/:id",
  verifyToken,
  authorize("RECEPCIONISTA"),
  getPacienteById /* #swagger.security = [{
            "bearerAuth": []
    }] */,
);
router.post(
  "/",
  verifyToken,
  authorize("RECEPCIONISTA"),
  validate(pacienteSchema),
  postPaciente,
);

router.put(
  "/:id",
  verifyToken,
  authorize("RECEPCIONISTA"),
  validate(pacienteSchema.partial()),
  putPaciente,
);

router.delete("/:id", verifyToken, authorize("RECEPCIONISTA"), deletePaciente);

export default router;

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
router.get("/:id", getPacienteById);
router.post(
  "/",
  verifyToken,
  authorize("RECEPCIONISTA"),
  validate(pacienteSchema),
  postPaciente /* #swagger.security = [{
            "bearerAuth": []
    }] */,
);
router.put("/:id", validate(pacienteSchema), putPaciente);
router.delete("/:id", deletePaciente);

export default router;

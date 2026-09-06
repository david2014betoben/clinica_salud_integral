import { Router } from "express";
import {
  getPacientes,
  postPaciente,
  putPaciente,
  deletePaciente,
} from "../controllers/paciente.controller";

const router: Router = Router();

router.get("/", getPacientes);
router.post("/", postPaciente);
router.put("/:id", putPaciente);
router.delete("/:id", deletePaciente);

export default router;

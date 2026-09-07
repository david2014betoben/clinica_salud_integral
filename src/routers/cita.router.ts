import { Router } from "express";
import {
  getAllCitas,
  getCitaById,
  createCita,
  updateCita,
  getDoctorAgenda,
  updateCitaEstado,
} from "../controllers/cita.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router: Router = Router();

router.get("/", getAllCitas);
router.get("/:id", getCitaById);
router.post("/", createCita);
router.put("/:id", updateCita);
router.get(
  "/citas/medico/:id/agenda",
  verifyToken,
  authorize("MEDICO"),
  getDoctorAgenda /* #swagger.security = [{
            "bearerAuth": []
    }] */,
);
router.patch(
  "/citas/:id/estado",
  verifyToken,
  authorize("MEDICO"),
  updateCitaEstado /* #swagger.security = [{
            "bearerAuth": []
    }] */,
);

export default router;

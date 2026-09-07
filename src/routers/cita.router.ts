import { Router } from "express";
import {
  getAllCitas,
  getCitaById,
  createCita,
  updateCita,
  getDoctorAgenda,
  updateCitaEstado,
  getAppointmentsBySpecialty,
  getDailyCutoff,
} from "../controllers/cita.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router: Router = Router();

//router.get("/", getAllCitas);
//router.get("/:id", getCitaById);
router.post(
  "/CREAR",
  verifyToken,
  authorize("RECEPCIONISTA", "MEDICO"),
  createCita /* #swagger.security = [{
            "bearerAuth": []
    }] */,
);
//router.put("/:id", updateCita);
router.get(
  "/medico/:id/agenda",
  verifyToken,
  authorize("MEDICO"),
  getDoctorAgenda /* #swagger.security = [{
            "bearerAuth": []
    }] */,
);
router.patch(
  "/:id/estado",
  verifyToken,
  authorize("MEDICO"),
  updateCitaEstado /* #swagger.security = [{
            "bearerAuth": []
    }] */,
);
router.get(
  "/reports/citas_especialidad",
  verifyToken,
  authorize("GERENCIA"),
  getAppointmentsBySpecialty,
  /* #swagger.security = [{
            "bearerAuth": []
    }] */
);
router.get(
  "/corte-diario/:fecha",
  verifyToken,
  authorize("GERENCIA"),
  getDailyCutoff /* #swagger.security = [{
            "bearerAuth": []
    }] */,
);

export default router;

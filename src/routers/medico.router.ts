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
  "/",
  verifyToken,
  authorize("RECEPCIONISTA", "GERENCIA"),
  getMedicos /* #swagger.security = [{
            "bearerAuth": []
    }] */,
);
router.post(
  "/",
  verifyToken,
  authorize("GERENCIA"),
  postMedico /* #swagger.security = [{
            "bearerAuth": []
    }] */,
);
router.put(
  "/:id",
  verifyToken,
  authorize("GERENCIA"),
  putMedico /* #swagger.security = [{
            "bearerAuth": []
    }] */,
);
router.delete(
  "/:id",
  verifyToken,
  authorize("GERENCIA"),
  deleteMedico /* #swagger.security = [{
            "bearerAuth": []
    }] */,
);

export default router;

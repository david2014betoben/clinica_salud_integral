import { Router } from "express";
import { register, login } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/auth.middleware";
import { authorize } from "../middlewares/authorize.middleware";

const router: Router = Router();

router.post(
  "/register",
  verifyToken,
  authorize("GERENCIA"),
  register /* #swagger.security = [{
            "bearerAuth": []
    }] */,
);
router.post("/login", login);

export default router;

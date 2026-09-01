import { Router } from "express";
import { getMedicos } from "../controllers/medico.controller";

const router: Router = Router();

router.get("/", getMedicos);
export default router;

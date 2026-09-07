import express from "express";
import dotenv from "dotenv";
import especialidadRouter from "./routers/especialidad.router";
import medicoRouter from "./routers/medico.router";
import pacienteRouter from "./routers/paciente.router";
import citaRouter from "./routers/cita.router";
import authRouter from "./routers/auth.routes";
import path from "node:path";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";
import type { Request, Response } from "express";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/especialidades", especialidadRouter);
app.use("/api/medicos", medicoRouter);
app.use("/api/pacientes", pacienteRouter);
app.use("/api/auth", authRouter);
app.use("/api/citas", citaRouter);

const swaggerFilePath = path.resolve("./src/swagger-output.json");

if (fs.existsSync(swaggerFilePath)) {
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, "utf-8"));

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} else {
  console.log("archivo swagger-output.json no encontrado");
}

app.get("/", function (req: Request, res: Response) {
  res.json({
    message: "servidor corriendo exitosamente",
  });
});

app.listen(PORT, () => {
  console.log(`Api corriendo en el http://localhost:${PORT}`);
});

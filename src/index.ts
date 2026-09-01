import express from "express";
import dotenv from "dotenv";
import especialidadRouter from "./routers/especialidad.router";
import medicoRouter from "./routers/medico.router";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/specialties", especialidadRouter);
app.use("/api/medicos", medicoRouter);

app.listen(PORT, () => {
  console.log(`Api corriendo en el http://localhost:${PORT}`);
});

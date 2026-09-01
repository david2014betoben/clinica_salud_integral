import type { Response, Request } from "express";
import { especialidadModel } from "../models/especialidad.model";

export const getEspecialidades = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productos = await especialidadModel.findAll();
    res.json({ data: productos });
  } catch (error: any) {
    res.status(500).json({ message: error });
  }
};

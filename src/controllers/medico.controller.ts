import type { Response, Request } from "express";
import { medicoModel } from "../models/medico.model";

export const getMedicos = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productos = await medicoModel.findAll();
    res.json({ data: productos });
  } catch (error: any) {
    res.status(500).json({ message: error });
  }
};

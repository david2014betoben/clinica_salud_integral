import type { Response, Request } from "express";
import { especialidadModel } from "../models/especialidad.model";

export const getEspecialidades = async (
  req: Request,
  res: Response,
): Promise<void> => {
  /*
  #swagger.tags = ['Especialidades']

  #swagger.summary = 'Obtener todas las especialidades'

  #swagger.description = 'Obtiene la lista de todas las especialidades médicas registradas en la clínica.'
*/
  try {
    const productos = await especialidadModel.findAll();
    res.json({ data: productos });
  } catch (error: any) {
    res.status(500).json({ message: error });
  }
};

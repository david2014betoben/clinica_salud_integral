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

export const postMedico = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { nombre, ap_paterno, ap_materno, telefono, email, especialidad_id } =
      req.body;

    if (!nombre || !ap_paterno || !especialidad_id) {
      res.status(400).json({
        err: "faltan campos obligatorios",
      });
      return;
    }

    const newMedico = await medicoModel.create(
      nombre,
      ap_paterno,
      especialidad_id,
      ap_materno,
      telefono,
      email,
    );

    res.status(201).json({
      message: "Médico creado con éxito",
      data: newMedico,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

export const putMedico = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        message: "El ID debe ser un número válido",
      });
      return;
    }

    const { nombre, ap_paterno, ap_materno, telefono, email, especialidad_id } =
      req.body;

    const updateMedico = await medicoModel.update(id, {
      nombre,
      ap_paterno,
      ap_materno,
      telefono,
      email,
      especialidad_id,
    });

    res.status(200).json({
      message: "Médico actualizado con éxito",
      data: updateMedico,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error del servidor",
    });
  }
};

export const deleteMedico = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        message: "El ID debe ser un número válido",
      });
      return;
    }

    await medicoModel.delete(id);

    res.status(200).json({
      message: "Médico eliminado exitosamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error del servidor",
    });
  }
};

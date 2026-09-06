import type { Response, Request } from "express";
import { pacienteModel } from "../models/paciente.model";

export const getPacientes = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search as string | undefined;

    const pacientes = await pacienteModel.findAll(page, limit, search);

    res.json(pacientes);
  } catch (error: any) {
    res.status(500).json({ message: error });
  }
};

export const postPaciente = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      nombre,
      ap_paterno,
      ap_materno,
      fecha_nacimiento,
      telefono,
      email,
    } = req.body;

    if (!nombre || !ap_paterno || !fecha_nacimiento) {
      res.status(400).json({
        err: "faltan campos obligatorios",
      });
      return;
    }

    const newPaciente = await pacienteModel.create(
      nombre,
      ap_paterno,
      fecha_nacimiento,
      ap_materno,
      telefono,
      email,
    );

    res.status(201).json({
      message: "Paciente creado con éxito",
      data: newPaciente,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};

export const putPaciente = async (
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

    const {
      nombre,
      ap_paterno,
      ap_materno,
      fecha_nacimiento,
      telefono,
      email,
    } = req.body;

    const updatePaciente = await pacienteModel.update(id, {
      nombre,
      ap_paterno,
      ap_materno,
      fecha_nacimiento,
      telefono,
      email,
    });

    res.status(200).json({
      message: "Paciente actualizado con éxito",
      data: updatePaciente,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error del servidor",
    });
  }
};

export const deletePaciente = async (
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

    await pacienteModel.delete(id);

    res.status(200).json({
      message: "Paciente eliminado exitosamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error del servidor",
    });
  }
};

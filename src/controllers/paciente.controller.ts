import type { Response, Request } from "express";
import { pacienteModel } from "../models/paciente.model";

export const getPacientes = async (
  req: Request,
  res: Response,
): Promise<void> => {
  /*
  #swagger.tags = ['Pacientes']

  #swagger.summary = 'Obtener todos los pacientes'

  #swagger.description = 'Obtiene la lista de todos los pacientes registrados en la clínica, con la posibilidad de buscar por nombre o apellido.'
*/
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

export const getPacienteById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  /*
  #swagger.tags = ['Pacientes']

  #swagger.summary = 'Obtener un paciente por ID'

  #swagger.description = 'Obtiene la información de un paciente específico mediante su ID, incluyendo sus datos personales.'

  #swagger.parameters['id'] = {
    in: 'path',
    required: true,
    type: 'integer',
    description: 'ID del paciente',
    example: 1
  }
*/
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ message: "El ID debe ser un número válido" });
      return;
    }
    const paciente = await pacienteModel.getPacienteById(id);
    if (!paciente) {
      res.status(404).json({ message: "Paciente no encontrado" });
      return;
    }
    res.status(200).json({ data: paciente });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

export const postPaciente = async (
  req: Request,
  res: Response,
): Promise<void> => {
  /*
  #swagger.tags = ['Pacientes']

  #swagger.summary = 'Crear un nuevo paciente'

  #swagger.description = 'Registra un nuevo paciente en la clínica.'

  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["nombre", "ap_paterno","fecha_nacimiento"],
          properties: {
            nombre: {
              type: "string",
              example: "Carlos"
            },
            ap_paterno: {
              type: "string",
              example: "Mamani"
            },
            ap_materno: {
              type: "string",
              example: "Quispe"
            },
            email: {
              type: "string",
              format: "email",
              example: "carlos.mamani@gmail.com"
            },
            telefono: {
              type: "string",
              example: "70012345"
            },
            fecha_nacimiento: {
              type: "string",
              format: "date",
              example: "1990-05-12"
            }
          }
        }
      }
    }
  }
*/
  try {
    const {
      nombre,
      ap_paterno,
      ap_materno,
      email,
      telefono,
      fecha_nacimiento,
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
      ap_materno,
      email,
      telefono,
      fecha_nacimiento,
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
  /*
  #swagger.tags = ['Pacientes']

  #swagger.summary = 'Actualizar un paciente'

  #swagger.description = 'Actualiza los datos personales de un paciente existente.'

  #swagger.parameters['id'] = {
    in: 'path',
    required: true,
    type: 'integer',
    description: 'ID del paciente',
    example: 1
  }

  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            nombre: {
              type: "string",
              example: "Carlos"
            },
            ap_paterno: {
              type: "string",
              example: "Mamani"
            },
            ap_materno: {
              type: "string",
              example: "Quispe"
            },
            email: {
              type: "string",
              format: "email",
              example: "carlos.mamani@gmail.com"
            },
            telefono: {
              type: "string",
              example: "70012345"
            },
            fecha_nacimiento: {
              type: "string",
              format: "date",
              example: "1990-05-12"
            }
          }
        }
      }
    }
  }
*/
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
      email,
      telefono,
      fecha_nacimiento,
    } = req.body;

    const updatePaciente = await pacienteModel.update(id, {
      nombre,
      ap_paterno,
      ap_materno,
      email,
      telefono,
      fecha_nacimiento,
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
  /*
  #swagger.tags = ['Pacientes']

  #swagger.summary = 'Eliminar un paciente'

  #swagger.description = 'Elimina un paciente registrado en la clínica mediante su ID.'

  #swagger.parameters['id'] = {
    in: 'path',
    required: true,
    type: 'integer',
    description: 'ID del paciente',
    example: 1
  }
*/
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

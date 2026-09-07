import type { Response, Request } from "express";
import { medicoModel } from "../models/medico.model";

export const getMedicos = async (
  req: Request,
  res: Response,
): Promise<void> => {
  /*
  #swagger.tags = ['Médicos']

  #swagger.summary = 'Obtener todos los médicos'

  #swagger.description = 'Obtiene la lista de todos los médicos registrados en la clínica, incluyendo la información de su especialidad, puede filtrar por especialidad.'
*/
  try {
    const specialtyName = req.query.specialtyName as string | undefined;

    const doctors = await medicoModel.getAllDoctors(specialtyName);

    res.status(200).json(doctors);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener los médicos",
    });
  }
};

export const postMedico = async (
  req: Request,
  res: Response,
): Promise<void> => {
  /*
  #swagger.tags = ['Médicos']

  #swagger.summary = 'Crear un nuevo médico'

  #swagger.description = 'Registra un nuevo médico en la clínica y lo asocia con una especialidad.'

    #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["nombre", "ap_paterno", "especialidad_id"],
          properties: {
            nombre: {
              type: "string",
              example: "Carlos"
            },
            ap_paterno: {
              type: "string",
              example: "Mendoza"
            },
            ap_materno: {
              type: "string",
              example: "Rojas"
            },
            email: {
              type: "string",
              format: "email",
              example: "carlos.mendoza@clinica.com"
            },
            telefono: {
              type: "string",
              example: "71012345"
            },
            especialidad_id: {
              type: "integer",
              example: 1
            }
          }
        }
      }
    }
  }
*/
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
  /*
  #swagger.tags = ['Médicos']

  #swagger.summary = 'Actualizar un médico'

  #swagger.description = 'Actualiza los datos de un médico existente, incluyendo su información personal y especialidad.'

  #swagger.parameters['id'] = {
    in: 'path',
    required: true,
    type: 'integer',
    description: 'ID del médico'
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
              example: "Mendoza"
            },
            ap_materno: {
              type: "string",
              example: "Rojas"
            },
            email: {
              type: "string",
              format: "email",
              example: "carlos.mendoza@clinica.com"
            },
            telefono: {
              type: "string",
              example: "71012345"
            },
            especialidad_id: {
              type: "integer",
              example: 1
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
  /*
  #swagger.tags = ['Médicos']

  #swagger.summary = 'Eliminar un médico'

  #swagger.description = 'Elimina un médico registrado en la clínica mediante su ID.'

   #swagger.parameters['id'] = {
    in: 'path',
    required: true,
    type: 'integer',
    description: 'ID del médico'
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

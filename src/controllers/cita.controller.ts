import type { Request, Response } from "express";
import { citaModel } from "../models/cita.model";
import { pacienteModel } from "../models/paciente.model";
import { medicoModel } from "../models/medico.model";
import { dailyCutoffSchema, createCitaSchema } from "../schemas/validate-cita";

export const getAllCitas = async (
  req: Request,
  res: Response,
): Promise<void> => {
  /*
  #swagger.tags = ['Citas']

  #swagger.summary = 'Obtener todas las citas'

  #swagger.description = 'Obtiene la lista de todas las citas registradas en la clínica, incluyendo la información del paciente, médico, especialidad e historial clínico.'
*/
  try {
    const citas = await citaModel.getAll();

    res.status(200).json(citas);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener las citas",
    });
  }
};

export const getCitaById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  /*
  #swagger.tags = ['Citas']

  #swagger.summary = 'Obtener una cita por ID'

  #swagger.description = 'Obtiene la información de una cita específica mediante su ID, incluyendo los datos del paciente, médico, especialidad e historial clínico.'

  #swagger.parameters['id'] = {
    in: 'path',
    required: true,
    type: 'integer',
    description: 'ID de la cita',
    example: 1
  }
*/
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        message: "El ID debe ser un número",
      });
      return;
    }

    const cita = await citaModel.getById(id);

    if (!cita) {
      res.status(404).json({
        message: "Cita no encontrada",
      });
      return;
    }

    res.status(200).json(cita);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al obtener la cita",
    });
  }
};

export const createCita = async (
  req: Request,
  res: Response,
): Promise<void> => {
  /*
  #swagger.tags = ['RECEPCIONISTAS']

  #swagger.summary = 'Crear una nueva cita'

  #swagger.description = 'Registra una nueva cita médica asociando un paciente con un médico, una fecha y una hora. Si no se especifica el estado, la cita será registrada como programada.'

  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["fecha", "hora", "id_paciente", "id_medico"],
          properties: {
            fecha: {
              type: "string",
              format: "date",
              example: "2026-09-15"
            },
            hora: {
              type: "string",
              pattern: "^([01]\\d|2[0-3]):(00|30)$",
              example: "14:30",
              description: "Hora de la cita en formato HH:mm. Debe estar en intervalos de 30 minutos."
            },
            id_paciente: {
              type: "integer",
              example: 1
            },
            id_medico: {
              type: "integer",
              example: 2
            }
          }
        }
      }
    }
  }
*/
  try {
    const result = createCitaSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        message: "Datos inválidos",
        errors: result.error.issues,
      });
      return;
    }

    const { fecha, hora, id_paciente, id_medico } = result.data;

    // Verificar que el paciente existe
    const paciente = await pacienteModel.getPacienteById(id_paciente);

    if (!paciente) {
      res.status(404).json({
        message: "El paciente no existe",
      });
      return;
    }

    // Verificar que el médico existe
    const medico = await medicoModel.findById(id_medico);

    if (!medico) {
      res.status(404).json({
        message: "El médico no existe",
      });
      return;
    }

    const horaDate = new Date(`1970-01-01T${hora}:00`);

    const cita = await citaModel.create({
      fecha: new Date(fecha),
      hora: horaDate,
      id_paciente,
      id_medico,
    });

    res.status(201).json({
      message: "Cita creada correctamente",
      data: cita,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al crear la cita",
    });
  }
};

export const updateCita = async (
  req: Request,
  res: Response,
): Promise<void> => {
  /*
  #swagger.tags = ['Citas']

  #swagger.summary = 'Actualizar una cita'

  #swagger.description = 'Actualiza los datos de una cita existente. Permite modificar la fecha, hora, estado, paciente o médico.'

  #swagger.parameters['id'] = {
    in: 'path',
    required: true,
    type: 'integer',
    description: 'ID de la cita',
    example: 1
  }

  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            fecha: {
              type: "string",
              format: "date",
              example: "2026-09-16"
            },
            hora: {
              type: "string",
              pattern: "^([01]\\d|2[0-3]):(00|30)$",
              example: "15:00",
              description: "Hora de la cita en formato HH:mm. Debe estar en intervalos de 30 minutos."
            },
            estado: {
              type: "string",
              enum: ["programada", "completada", "cancelada"],
              example: "completada"
            },
            id_paciente: {
              type: "integer",
              example: 1
            },
            id_medico: {
              type: "integer",
              example: 2
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
        message: "El ID debe ser un número",
      });
      return;
    }

    const { fecha, hora, estado, id_paciente, id_medico } = req.body;

    const data: {
      fecha?: Date;
      hora?: Date;
      estado?: string;
      id_paciente?: number;
      id_medico?: number;
    } = {};

    if (fecha) {
      data.fecha = new Date(fecha);
    }

    if (hora) {
      data.hora = new Date(`1970-01-01T${hora}:00`);
    }

    if (estado) {
      data.estado = estado;
    }

    if (id_paciente) {
      data.id_paciente = Number(id_paciente);
    }

    if (id_medico) {
      data.id_medico = Number(id_medico);
    }

    const cita = await citaModel.update(id, data);

    res.status(200).json({
      message: "Cita actualizada correctamente",
      data: cita,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Error al actualizar la cita",
    });
  }
};

export const getDoctorAgenda = async (
  req: Request,
  res: Response,
): Promise<void> => {
  /*
  #swagger.tags = ['MEDICOS']

  #swagger.summary = 'Obtener agenda de un médico'

  #swagger.description = 'Obtiene las citas correspondientes a un médico específico y permite filtrarlas por un rango de fechas.'

  #swagger.parameters['from'] = {
    in: 'query',
    required: false,
    type: 'string',
    format: 'date',
    description: 'Fecha inicial del rango',
    example: '2026-09-01'
  }

  #swagger.parameters['to'] = {
    in: 'query',
    required: false,
    type: 'string',
    format: 'date',
    description: 'Fecha final del rango',
    example: '2026-09-30'
  }
*/
  try {
    const id_medico = Number(req.params.id);

    if (isNaN(id_medico)) {
      res.status(400).json({
        message: "El ID del médico debe ser un número",
      });
      return;
    }

    const { from, to } = req.query;

    let fromDate: Date | undefined;
    let toDate: Date | undefined;

    if (from) {
      fromDate = new Date(from as string);

      if (isNaN(fromDate.getTime())) {
        res.status(400).json({
          message: "La fecha 'from' no es válida",
        });
        return;
      }
    }

    if (to) {
      toDate = new Date(to as string);

      if (isNaN(toDate.getTime())) {
        res.status(400).json({
          message: "La fecha 'to' no es válida",
        });
        return;
      }
    }

    if (fromDate && toDate && fromDate > toDate) {
      res.status(400).json({
        message: "La fecha 'from' no puede ser mayor que la fecha 'to'",
      });
      return;
    }

    // Verificar que el médico existe
    const medico = await medicoModel.findById(id_medico);

    if (!medico) {
      res.status(404).json({
        message: "El médico no existe",
      });
      return;
    }

    const agenda = await citaModel.getDoctorAgenda(id_medico, fromDate, toDate);

    res.status(200).json({
      message: "Agenda del médico obtenida correctamente",
      data: agenda,
    });
  } catch (error) {
    console.error(error);
    console.error("ERROR GET DOCTOR AGENDA:", error);

    res.status(500).json({
      message: "Error al obtener la agenda del médico",
    });
  }
};

export const updateCitaEstado = async (
  req: Request,
  res: Response,
): Promise<void> => {
  /*
  #swagger.tags = ['MEDICOS']
  #swagger.summary = 'Actualizar estado de una cita'
  #swagger.description = 'Permite cambiar el estado de una cita a completada o cancelada.'

  #swagger.parameters['id'] = {
    in: 'path',
    required: true,
    type: 'integer',
    description: 'ID de la cita',
    example: 1
  }

  #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        example: {
          estado: "completada"
        }
      }
    }
  }
*/
  try {
    const id = Number(req.params.id);
    const { estado } = req.body;

    // Validar ID
    if (isNaN(id)) {
      res.status(400).json({
        message: "El ID de la cita debe ser un número",
      });
      return;
    }

    // Validar estado
    if (estado !== "completada" && estado !== "cancelada") {
      res.status(400).json({
        message: "El estado debe ser 'completada' o 'cancelada'",
      });
      return;
    }

    // Verificar que la cita existe
    const cita = await citaModel.getById(id);

    if (!cita) {
      res.status(404).json({
        message: "La cita no existe",
      });
      return;
    }

    // Actualizar estado
    const citaActualizada = await citaModel.updatecitasEstado(id, estado);

    res.status(200).json({
      message: "Estado de la cita actualizado correctamente",
      data: citaActualizada,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el estado de la cita",
    });
  }
};

export const getAppointmentsBySpecialty = async (
  req: Request,
  res: Response,
): Promise<void> => {
  /* #swagger.tags = ['GERENCIA'] 
     
     #swagger.summary = 'Obtener cantidad de citas por especialidad' 
     
     #swagger.description = 'Obtiene la cantidad total de citas agrupadas por la especialidad del médico y ordenadas de mayor a menor.' 
  */
  try {
    const appointments = await citaModel.getAppointmentsBySpecialty();
    res.status(200).json({
      message: "Citas por especialidad obtenidas correctamente",
      data: appointments,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las citas por especialidad" });
  }
};

export const getDailyCutoff = async (
  req: Request,
  res: Response,
): Promise<void> => {
  /*#swagger.tags = ['GERENCIA']
  #swagger.summary = 'Obtener corte diario de citas'
  #swagger.description = 'Obtiene la cantidad de citas completadas y canceladas de una fecha específica.'

  #swagger.parameters['fecha'] = {
    in: 'path',
    required: true,
    type: 'string',
    format: 'date',
    description: 'Fecha del corte diario',
    example: '2026-09-07'
  }
*/
  try {
    const result = dailyCutoffSchema.safeParse(req.params);

    if (!result.success) {
      res.status(400).json({
        message: "Datos inválidos",
        errors: result.error.issues,
      });
      return;
    }

    const { fecha } = result.data;

    const cutoff = await citaModel.getDailyCutoff(fecha);

    res.status(200).json({
      message: "Corte diario obtenido correctamente",
      fecha,
      data: cutoff,
    });
  } catch (error) {
    console.error("ERROR GET DAILY CUTOFF:", error);

    res.status(500).json({
      message: "Error al obtener el corte diario",
    });
  }
};

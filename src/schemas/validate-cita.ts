import { z } from "zod";

export const citaEstadoShema = z.object({
  estado: z.enum(["completada", "cancelada"]),
});

export const dailyCutoffSchema = z.object({
  fecha: z.coerce.date(),
});

export const createCitaSchema = z.object({
  fecha: z.coerce
    .date()
    .min(new Date(), "No puedes agendar una cita en una fecha que ya pasó"),

  hora: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):(00|30)$/,
      "La hora debe tener formato HH:mm y estar en intervalos de 30 minutos",
    ),

  id_paciente: z.coerce
    .number()
    .int("El ID del paciente debe ser un número entero")
    .positive("El ID del paciente debe ser mayor a 0"),

  id_medico: z.coerce
    .number()
    .int("El ID del médico debe ser un número entero")
    .positive("El ID del médico debe ser mayor a 0"),
});

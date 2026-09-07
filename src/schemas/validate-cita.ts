import { z } from "zod";

export const appointmentSchema = z.object({
  id_paciente: z.number().int().positive(),
  id_medico: z.number().int().positive(),
  fecha: z.coerce
    .date()
    .min(new Date(), "No puedes agendar una cita en una fecha que ya pasó"),
  hora: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):(00|30)$/,
      "La hora debe tener formato HH:mm y estar en intervalos de 30 minutos",
    ),
  estado: z.enum(["completada", "cancelada"]),
});

export const dailyCutoffSchema = z.object({
  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener formato YYYY-MM-DD")
    .refine((fecha) => !isNaN(Date.parse(fecha)), "La fecha no es válida"),
});

export const createCitaSchema = z.object({
  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha debe tener formato YYYY-MM-DD")
    .refine((fecha) => !isNaN(Date.parse(fecha)), "La fecha no es válida"),

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

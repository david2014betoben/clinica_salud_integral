import { z } from "zod";

export const citaEstadoShema = z.object({
  estado: z.enum(["completada", "cancelada"]),
});

export const dailyCutoffSchema = z.object({
  fecha: z.coerce.date(),
});

export const createCitaSchema = z.object({
  fecha: z.coerce.date().refine(
    (fecha) => {
      const hoyBolivia = new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/La_Paz",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());

      const fechaCita = fecha.toISOString().slice(0, 10);

      return fechaCita >= hoyBolivia;
    },
    {
      message: "No puedes agendar una cita en una fecha que ya pasó",
    },
  ),

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

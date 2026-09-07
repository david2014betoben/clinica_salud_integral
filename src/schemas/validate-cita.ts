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

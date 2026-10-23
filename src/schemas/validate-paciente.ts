import { z } from "zod";

export const pacienteSchema = z.object({
  nombre: z.string().trim().min(1, "El nombre es obligatorio"),

  ap_paterno: z.string().trim().min(1, "El apellido paterno es obligatorio"),

  ap_materno: z.string().trim().optional(),

  email: z
    .string()
    .trim()
    .email("El correo no tiene un formato válido")
    .optional(),

  fecha_nacimiento: z.coerce
    .date()
    .refine(
      (fecha) => fecha.getTime() <= Date.now(),
      "La fecha de nacimiento no puede ser futura",
    ),

  telefono: z
    .string()
    .trim()
    .regex(
      /^\+?[0-9]{1,20}$/,
      "El teléfono debe contener números y puede empezar con +",
    )
    .optional(),
});

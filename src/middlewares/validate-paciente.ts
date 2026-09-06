import { z } from "zod";

export const pacienteSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  ap_paterno: z.string().min(1, "El apellido es obligatorio"),
  ap_materno: z.string().min(1, "El apellido es obligatorio").optional,
  email: z.string().email("El correo no tiene un formato válido").optional,
  fecha_nacimiento: z.coerce
    .date()
    .max(new Date(), "La fecha de nacimiento no puede ser futura").optional,
  telefono: z
    .string()
    .regex(
      /^\+?[0-9]{1,20}$/,
      "El teléfono debe ser solo números enteros y opcional con el signo +",
    ).optional,
});

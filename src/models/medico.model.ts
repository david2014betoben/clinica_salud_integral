import prisma from "../config/prisma";

export const medicoModel = {
  findAll: async () => {
    return await prisma.medico.findMany({
      select: {
        nombre: true,
        ap_paterno: true,
        telefono: true,
        especialidad: {
          select: {
            nombre: true,
          },
        },
      },
    });
  },

  create: async (
    nombre: string,
    ap_paterno: string,
    especialidad_id: number,
    ap_materno?: string,
    telefono?: string,
    email?: string,
  ) => {
    return await prisma.medico.create({
      data: {
        nombre,
        ap_paterno,
        especialidad_id,
        ...(ap_materno !== undefined && { ap_materno }),
        ...(telefono !== undefined && { telefono }),
        ...(email !== undefined && { email }),
      },
    });
  },

  update: async (
    id: number,
    data: {
      nombre?: string;
      ap_paterno?: string;
      ap_materno?: string;
      telefono?: string;
      email?: string;
      especialidad_id?: number;
    },
  ) => {
    return await prisma.medico.update({
      where: { id },
      data,
    });
  },

  delete: async (id: number) => {
    return await prisma.medico.delete({
      where: { id },
    });
  },
};

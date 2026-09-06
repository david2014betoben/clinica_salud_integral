import prisma from "../config/prisma";

export const medicoModel = {
  getAllDoctors(specialtyName?: string) {
    return prisma.medico.findMany({
      where: specialtyName
        ? {
            especialidad: {
              nombre: {
                equals: specialtyName,
                mode: "insensitive",
              },
            },
          }
        : {},
      include: {
        especialidad: true,
      },
    });
  },

  findById: async (id: number) => {
    return await prisma.medico.findUnique({
      where: { id },
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

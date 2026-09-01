import prisma from "../config/prisma";

export const medicoModel = {
  findAll: async () => {
    return await prisma.medico.findMany({
      /*orderBy: { id: "asc" },
      include: {
        especialidad: true,
      },*/
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
};

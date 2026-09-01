import prisma from "../config/prisma";

export const especialidadModel = {
  findAll: async () => {
    return await prisma.especialidad.findMany({
      orderBy: { id: "asc" },
    });
  },
};

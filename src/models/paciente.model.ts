import prisma from "../config/prisma";

export const pacienteModel = {
  findAll: async (page: number, limit: number, search?: string) => {
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            {
              nombre: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              ap_paterno: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
            {
              ap_materno: {
                contains: search,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {};

    const [data, total] = await Promise.all([
      prisma.paciente.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          id: "asc",
        },
      }),

      prisma.paciente.count({
        where,
      }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  getPacienteById(id: number) {
    return prisma.paciente.findUnique({
      where: { id },
      include: {
        citas: {
          include: { medico: { include: { especialidad: true } } },
          orderBy: { fecha: "desc" },
        },
      },
    });
  },

  create: async (
    nombre: string,
    ap_paterno: string,
    ap_materno?: string,
    email?: string,
    telefono?: string,
    fecha_nacimiento?: Date,
  ) => {
    return await prisma.paciente.create({
      data: {
        nombre,
        ap_paterno,
        ...(ap_materno !== undefined && { ap_materno }),
        ...(email !== undefined && { email }),
        ...(telefono !== undefined && { telefono }),
        ...(fecha_nacimiento !== undefined && {
          fecha_nacimiento: new Date(fecha_nacimiento),
        }),
      },
    });
  },

  update: async (
    id: number,
    data: {
      nombre?: string;
      ap_paterno?: string;
      ap_materno?: string;
      email?: string;
      telefono?: string;
      fecha_nacimiento?: Date;
    },
  ) => {
    return await prisma.paciente.update({
      where: { id },
      data,
    });
  },

  delete: async (id: number) => {
    return await prisma.paciente.delete({
      where: { id },
    });
  },
};

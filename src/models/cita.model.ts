import prisma from "../config/prisma";

export const citaModel = {
  getAll: async () => {
    return await prisma.cita.findMany({
      include: {
        paciente: true,
        medico: {
          include: {
            especialidad: true,
          },
        },
        historial: true,
      },
      orderBy: [
        {
          fecha: "asc",
        },
        {
          hora: "asc",
        },
      ],
    });
  },

  getById: async (id: number) => {
    return await prisma.cita.findUnique({
      where: {
        id,
      },
      include: {
        paciente: true,
        medico: {
          include: {
            especialidad: true,
          },
        },
        historial: true,
      },
    });
  },

  create: async (data: {
    fecha: Date;
    hora: Date;
    estado?: string;
    id_paciente: number;
    id_medico: number;
  }) => {
    return await prisma.cita.create({
      data: {
        fecha: data.fecha,
        hora: data.hora,
        estado: data.estado ?? "programada",
        id_paciente: data.id_paciente,
        id_medico: data.id_medico,
      },
      include: {
        paciente: true,
        medico: {
          include: {
            especialidad: true,
          },
        },
      },
    });
  },

  update: async (
    id: number,
    data: {
      fecha?: Date;
      hora?: Date;
      estado?: string;
      id_paciente?: number;
      id_medico?: number;
    },
  ) => {
    return await prisma.cita.update({
      where: {
        id,
      },
      data,
      include: {
        paciente: true,
        medico: {
          include: {
            especialidad: true,
          },
        },
        historial: true,
      },
    });
  },

  getDoctorAgenda(id_medico: number, from?: Date, to?: Date) {
    return prisma.cita.findMany({
      where: {
        id_medico,
        ...(from && to ? { fecha: { gte: from, lte: to } } : {}),
      },
      include: { paciente: true },
      orderBy: { fecha: "asc" },
    });
  },

  updatecitasEstado(id: number, estado: "completada" | "cancelada") {
    return prisma.cita.update({
      where: { id },
      data: { estado },
    });
  },

  getAppointmentsBySpecialty() {
    return prisma.$queryRaw`
    SELECT s.nombre AS especialidades, COUNT(a.id)::int AS total_citas
    FROM citas a
    INNER JOIN medicos d ON d.id = a.id_medico
    INNER JOIN especialidades s ON s.id = d.especialidad_id
    GROUP BY s.nombre
    ORDER BY total_citas DESC
  `;
  },

  getDailyCutoff(date: string) {
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);

    return prisma.cita.groupBy({
      by: ["estado"],
      where: {
        fecha: { gte: startOfDay, lte: endOfDay },
        estado: { in: ["COMPLETADA", "CANCELADA"] },
      },
      _count: { estado: true },
    });
  },
};

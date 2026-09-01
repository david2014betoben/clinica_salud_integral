/*
  Warnings:

  - You are about to drop the column `idMedico` on the `citas` table. All the data in the column will be lost.
  - You are about to drop the column `idPaciente` on the `citas` table. All the data in the column will be lost.
  - You are about to drop the column `idCita` on the `historial_clinico` table. All the data in the column will be lost.
  - You are about to drop the column `apMaterno` on the `medicos` table. All the data in the column will be lost.
  - You are about to drop the column `apPaterno` on the `medicos` table. All the data in the column will be lost.
  - You are about to drop the column `especialidadId` on the `medicos` table. All the data in the column will be lost.
  - You are about to drop the column `fechaNacimiento` on the `pacientes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_cita]` on the table `historial_clinico` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_medico` to the `citas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_paciente` to the `citas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_cita` to the `historial_clinico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ap_paterno` to the `medicos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `especialidad_id` to the `medicos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "citas" DROP CONSTRAINT "citas_idMedico_fkey";

-- DropForeignKey
ALTER TABLE "citas" DROP CONSTRAINT "citas_idPaciente_fkey";

-- DropForeignKey
ALTER TABLE "historial_clinico" DROP CONSTRAINT "historial_clinico_idCita_fkey";

-- DropForeignKey
ALTER TABLE "medicos" DROP CONSTRAINT "medicos_especialidadId_fkey";

-- DropIndex
DROP INDEX "historial_clinico_idCita_key";

-- AlterTable
ALTER TABLE "citas" DROP COLUMN "idMedico",
DROP COLUMN "idPaciente",
ADD COLUMN     "id_medico" INTEGER NOT NULL,
ADD COLUMN     "id_paciente" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "historial_clinico" DROP COLUMN "idCita",
ADD COLUMN     "id_cita" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "medicos" DROP COLUMN "apMaterno",
DROP COLUMN "apPaterno",
DROP COLUMN "especialidadId",
ADD COLUMN     "ap_materno" TEXT,
ADD COLUMN     "ap_paterno" TEXT NOT NULL,
ADD COLUMN     "especialidad_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "pacientes" DROP COLUMN "fechaNacimiento",
ADD COLUMN     "fecha_nacimiento" DATE;

-- CreateIndex
CREATE UNIQUE INDEX "historial_clinico_id_cita_key" ON "historial_clinico"("id_cita");

-- AddForeignKey
ALTER TABLE "historial_clinico" ADD CONSTRAINT "historial_clinico_id_cita_fkey" FOREIGN KEY ("id_cita") REFERENCES "citas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicos" ADD CONSTRAINT "medicos_especialidad_id_fkey" FOREIGN KEY ("especialidad_id") REFERENCES "especialidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citas" ADD CONSTRAINT "citas_id_paciente_fkey" FOREIGN KEY ("id_paciente") REFERENCES "pacientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "citas" ADD CONSTRAINT "citas_id_medico_fkey" FOREIGN KEY ("id_medico") REFERENCES "medicos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

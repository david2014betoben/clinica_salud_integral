/*
  Warnings:

  - You are about to drop the column `apMaterno` on the `pacientes` table. All the data in the column will be lost.
  - You are about to drop the column `apPaterno` on the `pacientes` table. All the data in the column will be lost.
  - Added the required column `ap_paterno` to the `pacientes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pacientes" DROP COLUMN "apMaterno",
DROP COLUMN "apPaterno",
ADD COLUMN     "ap_materno" TEXT,
ADD COLUMN     "ap_paterno" TEXT NOT NULL;

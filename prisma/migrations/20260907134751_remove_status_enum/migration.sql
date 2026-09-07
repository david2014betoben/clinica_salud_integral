-- AlterTable
ALTER TABLE "citas" ALTER COLUMN "estado" DROP NOT NULL,
ALTER COLUMN "estado" SET DEFAULT 'programada';

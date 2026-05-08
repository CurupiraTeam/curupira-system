-- CreateEnum
CREATE TYPE "NivelLog" AS ENUM ('INFO', 'AVISO', 'ERRO', 'DEBUG');

-- CreateTable
CREATE TABLE "logs_dispositivos" (
    "id" TEXT NOT NULL,
    "dispositivo_id" TEXT NOT NULL,
    "nivel" "NivelLog" NOT NULL DEFAULT 'INFO',
    "mensagem" TEXT NOT NULL,
    "detalhes" JSONB,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_dispositivos_pkey" PRIMARY KEY ("id")
);

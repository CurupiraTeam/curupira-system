-- CreateTable
CREATE TABLE "dispositivos_sensores" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dispositivos_sensores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leituras_sensores" (
    "id" TEXT NOT NULL,
    "dispositivo_id" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "unidade" TEXT NOT NULL DEFAULT 'µg/m³',
    "lido_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leituras_sensores_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "logs_dispositivos" ADD CONSTRAINT "logs_dispositivos_dispositivo_id_fkey" FOREIGN KEY ("dispositivo_id") REFERENCES "dispositivos_sensores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leituras_sensores" ADD CONSTRAINT "leituras_sensores_dispositivo_id_fkey" FOREIGN KEY ("dispositivo_id") REFERENCES "dispositivos_sensores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

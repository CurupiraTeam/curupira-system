-- CreateTable
CREATE TABLE "midias_relato" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "relato_usuario_id" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "midias_relato_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "midias_relato" ADD CONSTRAINT "midias_relato_relato_usuario_id_fkey" FOREIGN KEY ("relato_usuario_id") REFERENCES "relatos_usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

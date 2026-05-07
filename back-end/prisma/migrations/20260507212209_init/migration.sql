-- CreateEnum
CREATE TYPE "PapelUsuario" AS ENUM ('ADMIN', 'CIDADAO');

-- CreateEnum
CREATE TYPE "StatusRelato" AS ENUM ('ATIVO', 'RESOLVIDO', 'FALSO');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "papel" "PapelUsuario" NOT NULL DEFAULT 'CIDADAO',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias_relato" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "icone_url" TEXT,

    CONSTRAINT "categorias_relato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relatos_usuarios" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "categoria_id" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "descricao" TEXT,
    "referencia_endereco" TEXT,
    "status" "StatusRelato" NOT NULL DEFAULT 'ATIVO',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "relatos_usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "relatos_oficiais" (
    "id" TEXT NOT NULL,
    "fonte" TEXT NOT NULL,
    "id_externo" TEXT,
    "categoria_id" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "metadados" JSONB,
    "detectado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "relatos_oficiais_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "categorias_relato_nome_key" ON "categorias_relato"("nome");

-- AddForeignKey
ALTER TABLE "relatos_usuarios" ADD CONSTRAINT "relatos_usuarios_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatos_usuarios" ADD CONSTRAINT "relatos_usuarios_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias_relato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "relatos_oficiais" ADD CONSTRAINT "relatos_oficiais_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias_relato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

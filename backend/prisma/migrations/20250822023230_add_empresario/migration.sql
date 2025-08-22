/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Produtor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Empresario" (
    "cod_empresario" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Empresario_email_key" ON "Empresario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Empresario_cnpj_key" ON "Empresario"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "Produtor_email_key" ON "Produtor"("email");

-- CreateTable
CREATE TABLE "produtor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "cpf" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Empresario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "produto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descricao" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "imagem" TEXT,
    "preco" REAL NOT NULL,
    "validade" TEXT NOT NULL,
    "cod_produtor" INTEGER NOT NULL,
    CONSTRAINT "produto_cod_produtor_fkey" FOREIGN KEY ("cod_produtor") REFERENCES "produtor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "produtor_email_key" ON "produtor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "produtor_cpf_key" ON "produtor"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Empresario_email_key" ON "Empresario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Empresario_cnpj_key" ON "Empresario"("cnpj");

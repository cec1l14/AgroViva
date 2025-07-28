-- CreateTable
CREATE TABLE "Produtor" (
    "cod_produtor" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "cpf" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Produto" (
    "cod_produto" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "preco" REAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "imagem" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "cod_produtor" INTEGER NOT NULL,
    CONSTRAINT "Produto_cod_produtor_fkey" FOREIGN KEY ("cod_produtor") REFERENCES "Produtor" ("cod_produtor") ON DELETE RESTRICT ON UPDATE CASCADE
);

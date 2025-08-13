/*
  Warnings:

  - Added the required column `validade` to the `Produto` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Produto" (
    "cod_produto" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "validade" TEXT NOT NULL,
    "preco" REAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "imagem" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "cod_produtor" INTEGER NOT NULL,
    CONSTRAINT "Produto_cod_produtor_fkey" FOREIGN KEY ("cod_produtor") REFERENCES "Produtor" ("cod_produtor") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Produto" ("cod_produto", "cod_produtor", "descricao", "imagem", "preco", "tipo") SELECT "cod_produto", "cod_produtor", "descricao", "imagem", "preco", "tipo" FROM "Produto";
DROP TABLE "Produto";
ALTER TABLE "new_Produto" RENAME TO "Produto";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

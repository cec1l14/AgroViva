import Database from './database.js';

async function up() {
  const db = await Database.connect();

  const produtorSql = `
    CREATE TABLE IF NOT EXISTS produtor (
      cod_produtor INTEGER PRIMARY KEY AUTOINCREMENT,
      email VARCHAR(40) NOT NULL,
      telefone NUMERIC(13) NOT NULL,
      cod_id INTEGER NOT NULL,
      senha VARCHAR(40) NOT NULL,
      cpf NUMERIC(11) NOT NULL
    );
  `;

  const produtosSql = `
    CREATE TABLE IF NOT EXISTS produtos (
      cod_produto INTEGER PRIMARY KEY AUTOINCREMENT,
      validade DATE,
      preco FLOAT,
      descricao VARCHAR(40),
      imagem VARCHAR(255),
      tipo VARCHAR(40),
      cod_produtor INTEGER NOT NULL,
      FOREIGN KEY (cod_produtor) REFERENCES produtor(cod_produtor)
    );
  `;

  await db.run(produtorSql);
  await db.run(produtosSql);
}

export default { up };

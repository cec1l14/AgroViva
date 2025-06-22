import Database from './database.js';

async function up() {
  const db = await Database.connect();

  const produtosSql = `
    CREATE TABLE IF NOT EXISTS produtos (
      cod_produto INTEGER PRIMARY KEY AUTOINCREMENT,
      validade DATE,
      preco FLOAT,
      descricao VARCHAR(40)
    );
  `;


  await db.run(produtosSql);
}

export default { up };

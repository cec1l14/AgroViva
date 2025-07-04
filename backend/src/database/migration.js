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
  const produtorSql = `
    CREATE TABLE if note exists produtor (
      cod_produtor integer primary key autoincremet,
      email varchar (40) not null,
      telefone numeric (13) not null,
      cod_id integer not null,
      senha varchar (40) not null,
      cpf numeric (11) not null
    );
  `;
  await db.run(produtosSql);
  await db.run (produtorSql);
}

export default { up };

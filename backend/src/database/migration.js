import Database from './database.js';
 
async function up() {
  const db = await Database.connect();
 
  const investmentsSql = `
    CREATE TABLE produtos (
        cod_produto integer PRIMARY KEY, AUTOINCREMENT
  validade DATE,
  preco FLOAT,
  descricao VARCHAR(40));

    )
  `;
 
  await db.run(investmentsSql);
}
 
export default { up };
 
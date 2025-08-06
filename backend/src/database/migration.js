import Database from './database.js';

async function up() {
  const db = await Database.connect();

  const produtorSql = 
   

  await db.run(produtorSql);
  await db.run(produtosSql);
}

export default { up };

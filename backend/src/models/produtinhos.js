import Database from '../database/database.js';

async function create({ nome, tipo, imagem }) {
  const db = await Database.connect();
  const result = await db.run(
    'INSERT INTO produtos (nome, tipo, imagem) VALUES (?, ?, ?)',
    [nome, tipo, imagem]
  );
  return { id: result.lastID, nome, tipo, imagem };
}

async function read() {
  const db = await Database.connect();
  const produtos = await db.all('SELECT * FROM produtos');
  return produtos;
}

export default { create, read };

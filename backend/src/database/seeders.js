import Database from './database.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Caminho absoluto para o JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const jsonPath = path.join(__dirname, 'seeders.json');

async function up() {
  const db = await Database.connect();

  const jsonData = await fs.readFile(jsonPath, 'utf-8');
  const data = JSON.parse(jsonData);

  // Inserir produtores
  for (const produtor of data.produtor) {
    await db.run(`
      INSERT INTO produtor (email, telefone, cod_id, senha, cpf)
      VALUES (?, ?, ?, ?, ?)
    `, [
      produtor.email,
      produtor.telefone,
      produtor.cod_id,
      produtor.senha,
      produtor.cpf
    ]);
  }

  // Inserir produtos
  for (const produto of data.produtos) {
    await db.run(`
      INSERT INTO produtos (descricao, preco, validade, cod_produtor, imagem, tipo)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
      produto.descricao,
      produto.preco,
      produto.validade,
      produto.cod_produtor,
      produto.imagem,
      produto.tipo
    ]);
  }

  console.log('Dados inseridos!');
}

export default { up };




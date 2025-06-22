import { resolve } from 'path';
import { readFileSync } from 'fs';
import Database from './database.js';

const __dirname = resolve();

async function up() {
  const db = await Database.connect();
  

  const file = resolve(__dirname, 'src/database/seeders.json');
  
  try {
    const seed = JSON.parse(readFileSync(file, 'utf-8'));
    
    for (const produto of seed.produtos) {
      await db.run(
        'INSERT INTO produtos (nome, tipo, imagem) VALUES (?, ?, ?)',
        [produto.nome, produto.tipo, produto.imagem]
      );
    }
    console.log('Dados inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao ler/inserir dados:', error);
    throw error;
  } finally {
    await db.close();
  }
}

export default { up };
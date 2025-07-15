import Database from '../database/database.js';

async function create({ descricao, tipo, imagem, validade, preco, cod_produtor }) {
  const db = await Database.connect();
  const result = await db.run(
    `INSERT INTO produtos (descricao, tipo, imagem, validade, preco, cod_produtor) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [descricao, tipo, imagem, validade, preco, cod_produtor]
  );
  return { 
    cod_produto: result.lastID, 
    descricao, 
    tipo, 
    imagem, 
    validade, 
    preco, 
    cod_produtor 
  };
}

async function read() {
  const db = await Database.connect();
  const produtos = await db.all('SELECT * FROM produtos');
  return produtos;
}

async function readProdutores() {
  const db = await Database.connect();
  const produtores = await db.all('SELECT * FROM produtor');
  return produtores;
}

export default { create, read, readProdutores };


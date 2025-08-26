import { PrismaClient } from '../generated/prisma/client.js';

const prisma = new PrismaClient();

async function createProduto({ descricao, tipo, imagem, validade, preco, cod_produtor }) {
  const produto = await prisma.produto.create({
    data: {
      descricao,
      tipo,
      imagem: imagem || null,
      validade: new Date(validade),
      preco,
      cod_produtor
    }
  });
  return produto;
}

async function createProdutor({ email, telefone, nome, senha, cpf }) {
  const produtor = await prisma.produtor.create({
    data: {
      email,
      telefone,
      nome,
      senha,
      cpf
    }
  });
  return produtor;
}

async function readProdutos() {
  const produtos = await prisma.produto.findMany();
  return produtos;
}

async function readProdutores() {
  const produtores = await prisma.produtor.findMany();
  return produtores;
}

export { createProduto, createProdutor, readProdutos, readProdutores };

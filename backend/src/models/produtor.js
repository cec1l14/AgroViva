import { PrismaClient } from '../generated/prisma/client.js';

const prisma = new PrismaClient();

// Criar um produtor
async function createProdutor({ email, telefone, nome, senha, cpf }) {
  const produtor = await prisma.produtor.create({
    data: {
      email,
      telefone,
      nome,
      senha,
      cpf,
    },
  });
  return produtor;
}

// Listar todos os produtores, opcionalmente incluindo seus produtos
async function readProdutores(includeProdutos = false) {
  const produtores = await prisma.produtor.findMany({
    include: includeProdutos ? { produtos: true } : undefined,
  });
  return produtores;
}

export default {
  createProdutor,
  readProdutores,
};

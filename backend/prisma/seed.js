import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { PrismaClient } from '../src/generated/prisma/client.js';
const prisma = new PrismaClient();

async function main() {
  // Resolve o caminho para o seeders.json dentro da pasta prisma
  const file = resolve('', 'prisma/seeders.json');
  const seed = JSON.parse(readFileSync(file, 'utf-8'));

  // Insere produtores usando upsert (evita duplicidade de CPF)
  if (seed.produtor && seed.produtor.length > 0) {
    for (const p of seed.produtor) {
      await prisma.produtor.upsert({
        where: { cpf: p.cpf },
        update: {}, // não atualiza se já existir
        create: {
          nome: p.nome,
          email: p.email,
          telefone: p.telefone,
          senha: p.senha,
          cpf: p.cpf
        }
      });
    }
  }

  // Insere empresários usando upsert (evita duplicidade de email ou cnpj)
  if (seed.empresario && seed.empresario.length > 0) {
    for (const e of seed.empresario) {
      await prisma.empresario.upsert({
        where: { cnpj: e.cnpj },
        update: {}, // não atualiza se já existir
        create: {
          nome: e.nome,
          email: e.email,
          senha: e.senha,
          telefone: e.telefone,
          cnpj: e.cnpj
        }
      });
    }
  }

  // Insere produtos usando upsert (evita duplicidade de combinação descricao + cod_produtor)
  if (seed.produtos && seed.produtos.length > 0) {
    for (const pr of seed.produtos) {
      // Supondo que a combinação (descricao + cod_produtor) deve ser única
      await prisma.produto.upsert({
        where: {
          // você precisa definir um campo @unique no schema ou usar id se disponível
          id: pr.id ?? 0 // se id não existe, poderia criar outro critério de unicidade
        },
        update: {}, // não atualiza se já existir
        create: {
          descricao: pr.descricao,
          tipo: pr.tipo,
          imagem: pr.imagem,
          preco: pr.preco,
          validade: pr.validade,
          cod_produtor: pr.cod_produtor
        }
      });
    }
  }

  console.log('Seed finalizado com sucesso!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

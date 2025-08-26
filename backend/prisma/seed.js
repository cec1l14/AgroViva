import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { PrismaClient } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient();

async function main() {
  // Resolve o caminho para o seeders.json dentro da pasta prisma
  const file = resolve('', 'prisma/seeders.json');
  const seed = JSON.parse(readFileSync(file, 'utf-8'));

  // Insere produtores
  if (seed.produtor && seed.produtor.length > 0) {
    await prisma.produtor.createMany({
      data: seed.produtor,
    });
  }

  // Insere empresários
  if (seed.empresario && seed.empresario.length > 0) {
    await prisma.empresario.createMany({
      data: seed.empresario,
    });
  }

  // Insere produtos
  if (seed.produtos && seed.produtos.length > 0) {
    await prisma.produto.createMany({
      data: seed.produtos,
    });
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

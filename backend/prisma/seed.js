import { resolve } from 'node:path';
import { readFileSync } from 'node:fs';
import { PrismaClient } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient();

async function main() {
  const file = resolve('', 'seeders.json');
  const seed = JSON.parse(readFileSync(file));

  // Insere produtores
  await prisma.produtor.createMany({
    data: seed.produtor,
  });

  // Insere produtos
  await prisma.produto.createMany({
    data: seed.produtos,
  });
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

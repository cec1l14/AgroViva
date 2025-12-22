import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from '../src/generated/prisma/client.js';
const prisma = new PrismaClient();

async function run() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL);

  const produtores = await prisma.produtor.findMany();
  const empresarios = await prisma.empresario.findMany();

  console.log("Produtores:", produtores);
  console.log("Empresarios:", empresarios);
}

run();

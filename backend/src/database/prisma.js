import '../config/env.js'; //importação do env para evitar problemas
import { PrismaClient } from '../generated/prisma/client.js';

const prisma = new PrismaClient();

export default prisma;

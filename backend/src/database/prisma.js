import '../config/env.js'; // 🔥 GARANTE ENV ANTES DE TUDO
import { PrismaClient } from '../generated/prisma/client.js';

const prisma = new PrismaClient();

export default prisma;

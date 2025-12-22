import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../../.env'),
});

if (!process.env.DATABASE_URL) {
  console.error(' DATABASE_URL NÃO CARREGADA');
  process.exit(1);
}

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'url';
import { Database } from 'sqlite-async';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbFile = resolve(__dirname, 'db.sqlite'); 

async function connect() {
  return await Database.open(dbFile);
}

export default { connect };

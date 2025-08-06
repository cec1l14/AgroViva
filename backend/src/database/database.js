import { PrismaClient} from 

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbFile = resolve(__dirname, 'db.sqlite'); 

async function connect() {
  return await Database.open(dbFile);
}

export default { connect };
generator client {
  provider = "prisma-client-js"
}
 
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
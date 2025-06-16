import { produtos } from '../models/produtinhos.js';

async function up() {
  const file = resolve('src', 'data', 'seeders.json');
 
  const seed = JSON.parse(readFileSync(file));
 
  for (const produtos of seed.produtos) {
    await produtinhos.create(produtos);
  }
}
 
export default { up };
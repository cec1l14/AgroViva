import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { produtos } from './data/dados.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// carregando os arquivos de public

app.use(express.static(path.join(__dirname, '../public')));
app.use('/imagens', express.static('../../imagens'));


// rota para home.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/home.html'));
});

// rota para carregar os produtos

app.get('/produtos', (req, res) => {
  res.json(produtos);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


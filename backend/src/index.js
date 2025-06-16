import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import  produtos  from './database/seeders.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// carregando os arquivos de public

app.use(express.static(path.join(__dirname, '../public')));
app.use('/imagens', express.static('../../imagens'));
app.use(express.json());

// rota para home.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/home.html'));
});

// rota para carregar os produtos

app.get('/produtos', (req, res) => {
  res.json(produtos);
});

//rota para cadastro
app.use(express.json()); // Para interpretar JSON no corpo

app.post('/cadastro', (req, res) => {
  const { nome, email, senha, tipo } = req.body;

  if (!(nome && email && senha)) {
    return res.status(400).json({ error: 'Dados incompletos' });
  }

  console.log('Novo cadastro:', req.body);

  res.status(201).json({ message: 'Cadastro realizado com sucesso' });
});
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


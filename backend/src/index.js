import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Serve a pasta 'imagens' para URLs começando com '/imagens'
app.use('/imagens', express.static(path.join(__dirname, '../../imagens')));

// Para receber JSON no corpo das requisições
app.use(express.json());

// Rota para a raiz '/', serve o arquivo home.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/home.html'));
});
//rota para o cadastro
app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/cadastro.html'));
});

// Rota para a API, usando o router importado
app.use('/api', router);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});


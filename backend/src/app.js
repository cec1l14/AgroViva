import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ========================
// Middlewares
// ========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use('/imagens', express.static(path.join(__dirname, '../../imagens')));

// ========================
// Rotas principais
// ========================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/cadastro.html'));
});

// Rotas da API
app.use('/api', router);

export default app;

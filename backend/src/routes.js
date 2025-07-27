import express from 'express';
import Produto from './models/produtinhos.js';

const router = express.Router();

router.get('/produtos', async (req, res) => {
  try {
    const produtos = await Produto.read();
    res.json(produtos);
  } catch (error) {
    console.error('Erro na rota /api/produtos:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/produtor', async (req, res) => {
  try {
    const produtor = await Produto.readB(); // corrigido aqui
    res.json(produtor);
  } catch (error) {
    console.error('Erro na rota /api/produtor:', error);
    res.status(500).json({ error: error.message });
  }
});
router.post('/produtor', async (req, res) => {
  try {
    const { email, telefone, nome, senha, cpf } = req.body;

    if (!email || !telefone || !nome || !senha || !cpf) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const db = await Produto.createProdutor({ email, telefone, nome, senha, cpf });

    res.status(201).json({ message: 'Produtor cadastrado com sucesso!', db });
  } catch (error) {
    console.error('Erro ao cadastrar produtor:', error);
    res.status(500).json({ error: 'Erro ao cadastrar produtor' });
  }
});


export default router;
 
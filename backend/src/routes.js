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

export default router;
 
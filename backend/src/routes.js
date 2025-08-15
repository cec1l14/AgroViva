import express from 'express';
import prisma from './database/database.js';

const router = express.Router();

// GET todos os produtos
router.get('/produtos', async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      include: { produtor: true } // inclui dados do produtor em cada produto
    });
    res.json(produtos);
  } catch (error) {
    console.error('Erro na rota /api/produtos:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET todos os produtores
router.get('/produtor', async (req, res) => {
  try {
    const produtores = await prisma.produtor.findMany({
      include: { produtos: true } // inclui produtos de cada produtor
    });
    res.json(produtores);
  } catch (error) {
    console.error('Erro na rota /api/produtor:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST cadastrar produtor
router.post('/produtor', async (req, res) => {
  try {
    const { email, telefone, nome, senha, cpf } = req.body;

    if (!email || !telefone || !nome || !senha || !cpf) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const novoProdutor = await prisma.produtor.create({
      data: { email, telefone, nome, senha, cpf }
    });

    res.status(201).json({ message: 'Produtor cadastrado com sucesso!', novoProdutor });
  } catch (error) {
    console.error('Erro ao cadastrar produtor:', error);
    res.status(500).json({ error: 'Erro ao cadastrar produtor' });
  }
});

// POST cadastrar produto
router.post('/produtos', async (req, res) => {
  try {
    const { validade, preco, descricao, imagem, tipo, cod_produtor } = req.body;

    if (!validade || !preco || !descricao || !imagem || !tipo || !cod_produtor) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const novoProduto = await prisma.produto.create({
      data: {
        validade,
        preco,
        descricao,
        imagem,
        tipo,
        cod_produtor
      }
    });

    res.status(201).json({ message: 'Produto cadastrado com sucesso!', novoProduto });
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    res.status(500).json({ error: 'Erro ao cadastrar produto' });
  }
});

export default router;

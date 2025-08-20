import express from 'express';
import { PrismaClient } from '../generated/prisma/client.js';

const router = express.Router();
const prisma = new PrismaClient();

// ========================
// GET todos os produtos
// ========================
router.get('/produtos', async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      include: { produtor: true } // traz dados do produtor junto
    });
    res.json(produtos);
  } catch (error) {
    console.error('Erro na rota /produtos:', error);
    res.status(500).json({ error: error.message });
  }
});

// ========================
// POST cadastrar produtor
// ========================
router.post('/produtor', async (req, res) => {
  const { email, telefone, nome, senha, cpf, tipo } = req.body;
  if (!email || !telefone || !nome || !senha || !cpf || !tipo) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  try {
    const novoProdutor = await prisma.produtor.create({
      data: { email, telefone, nome, senha, cpf, tipo }
    });
    res.status(201).json({ message: 'Produtor cadastrado com sucesso!', novoProdutor });
  } catch (error) {
    console.error('Erro ao cadastrar produtor:', error);
    res.status(500).json({ error: 'Erro ao cadastrar produtor' });
  }
});

// ========================
// POST login básico
// ========================
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    const produtor = await prisma.produtor.findFirst({
      where: { email, senha } // comparação direta, sem bcrypt
    });

    if (!produtor) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    res.status(200).json({
      message: 'Login realizado com sucesso',
      produtor: {
        cod_produtor: produtor.cod_produtor,
        nome: produtor.nome,
        email: produtor.email,
        telefone: produtor.telefone,
        cpf: produtor.cpf,
        tipo: produtor.tipo
      }
    });
  } catch (error) {
    console.error('Erro ao logar:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// ========================
// POST cadastrar produto
// ========================
router.post('/produtos', async (req, res) => {
  const { validade, preco, descricao, imagem, tipo, cod_produtor } = req.body;
  if (!validade || !preco || !descricao || !imagem || !tipo || !cod_produtor) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    const novoProduto = await prisma.produto.create({
      data: { validade, preco, descricao, imagem, tipo, cod_produtor }
    });
    res.status(201).json({ message: 'Produto cadastrado com sucesso!', novoProduto });
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    res.status(500).json({ error: 'Erro ao cadastrar produto' });
  }
});

// ========================
// GET produtor por ID
// ========================
router.get('/produtor/:id', async (req, res) => {
  const produtorId = Number(req.params.id);
  try {
    const produtor = await prisma.produtor.findUnique({
      where: { cod_produtor: produtorId }
    });
    if (!produtor) return res.status(404).json({ error: 'Produtor não encontrado' });
    res.json(produtor);
  } catch (error) {
    console.error('Erro ao buscar produtor:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

export default router;
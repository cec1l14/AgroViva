import express from 'express';
import { PrismaClient } from './generated/prisma/client.js';

const router = express.Router();
const prisma = new PrismaClient();

// ========================
// GET todos os produtos
// ========================
router.get('/produtos', async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({
      include: { produtor: true }
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
  const { email, telefone, nome, senha, cpf } = req.body;
  if (!email || !telefone || !nome || !senha || !cpf) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  try {
    const novoProdutor = await prisma.produtor.create({
      data: { email, telefone, nome, senha, cpf }
    });
    res.status(201).json({ message: 'Produtor cadastrado com sucesso!', novoProdutor });
  } catch (error) {
    console.error('Erro ao cadastrar produtor:', error);
    res.status(500).json({ error: 'Erro ao cadastrar produtor' });
  }
});

// ========================
// POST cadastrar empresário
// ========================
router.post('/empresario', async (req, res) => {
  const { email, nome, senha, cnpj } = req.body;
  if (!email || !nome || !senha || !cnpj) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }
  try {
    const novoEmpresario = await prisma.empresario.create({
      data: { email, nome, senha, cnpj }
    });
    res.status(201).json({ message: 'Empresário cadastrado com sucesso!', novoEmpresario });
  } catch (error) {
    console.error('Erro ao cadastrar empresário:', error);
    res.status(500).json({ error: 'Erro ao cadastrar empresário' });
  }
});

// ========================
// POST login unificado (produtor ou empresário)
// ========================
// ========================
// POST login sem tipo
// ========================
router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    // 1️⃣ Buscar em Produtor
    const produtor = await prisma.produtor.findFirst({
      where: { email, senha }
    });

    if (produtor) {
      return res.status(200).json({
        message: 'Login realizado com sucesso',
        tipo: 'produtor',
        usuario: {
          cod: produtor.cod_produtor,
          nome: produtor.nome,
          email: produtor.email,
          telefone: produtor.telefone,
          cpf: produtor.cpf
        }
      });
    }

    // 2 Se não encontrou, buscar em Empresário
    const empresario = await prisma.empresario.findFirst({
      where: { email, senha }
    });

    if (empresario) {
      return res.status(200).json({
        message: 'Login realizado com sucesso',
        tipo: 'empresario',
        usuario: {
          cod: empresario.cod_empresario,
          nome: empresario.nome,
          email: empresario.email,
          cnpj: empresario.cnpj
        }
      });
    }

    // 3️⃣ Se não encontrou em nenhum
    return res.status(401).json({ error: 'Email ou senha incorretos' });

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
  if (!validade || !preco || !descricao || !tipo || !cod_produtor) {
    return res.status(400).json({ error: 'Todos os campos obrigatórios exceto imagem' });
  }

  try {
    const novoProduto = await prisma.produto.create({
      data: {
        validade: new Date(validade),
        preco,
        descricao,
        tipo,
        cod_produtor,
        imagem: imagem || null
      }
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

// ========================
// GET empresário por ID
// ========================
router.get('/empresario/:id', async (req, res) => {
  const empresarioId = Number(req.params.id);
  try {
    const empresario = await prisma.empresario.findUnique({
      where: { cod_empresario: empresarioId }
    });
    if (!empresario) return res.status(404).json({ error: 'Empresário não encontrado' });
    res.json(empresario);
  } catch (error) {
    console.error('Erro ao buscar empresário:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

export default router;

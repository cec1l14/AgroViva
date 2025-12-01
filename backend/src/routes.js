import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from './generated/prisma/client.js';
import { z } from 'zod';
import { isAuthenticated } from './middleware/autentico.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const prisma = new PrismaClient();

// ========================
// Garantir que a pasta de imagens exista
// ========================
const imagensDir = path.join(__dirname, '../../imagens'); // ../imagens a partir de src/
if (!fs.existsSync(imagensDir)) {
  fs.mkdirSync(imagensDir, { recursive: true });
}

// ========================
// Configuração Multer
// ========================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, imagensDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ========================
// LOGIN (JWT)
// ========================
router.post('/login', async (req, res) => {
  const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    senha: z.string().min(4, 'Senha deve ter pelo menos 4 caracteres'),
  });

  try {
    const { email, senha } = loginSchema.parse(req.body);

    const produtor = await prisma.produtor.findFirst({ where: { email, senha } });
    if (produtor) {
      const token = jwt.sign({ userId: produtor.id, tipo: 'produtor' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({
        message: 'Login realizado com sucesso',
        tipo: 'produtor',
        usuario: {
          id: produtor.id,
          nome: produtor.nome,
          email: produtor.email,
          cpf: produtor.cpf,
          telefone: produtor.telefone || null
        },
        token,
      });
    }

    const empresario = await prisma.empresario.findFirst({ where: { email, senha } });
    if (empresario) {
      const token = jwt.sign({ userId: empresario.id, tipo: 'empresario' }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({
        message: 'Login realizado com sucesso',
        tipo: 'empresario',
        usuario: {
          id: empresario.id,
          nome: empresario.nome,
          email: empresario.email,
          cnpj: empresario.cnpj,
          telefone: empresario.telefone || null
        },
        token,
      });
    }

    return res.status(401).json({ error: 'Email ou senha incorretos' });
  } catch (error) {
    console.error('Erro ao logar:', error);
    if (error instanceof z.ZodError) {
      const erros = error.errors.map(e => ({ field: e.path[0], message: e.message }));
      return res.status(400).json({ errors: erros });
    }
    return res.status(500).json({ errors: [{ field: null, message: 'Erro interno ao logar' }] });
  }
});

// ========================
// CADASTRAR PRODUTOR
// ========================
router.post('/produtor', async (req, res) => {
  const schema = z.object({
    nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    telefone: z.string().optional(),
    cpf: z.string().optional(),
  });

  try {
    const parsed = schema.parse(req.body);
    const novoProdutor = await prisma.produtor.create({ data: parsed });
    res.status(201).json({ message: 'Produtor cadastrado com sucesso', produtor: novoProdutor });
  } catch (error) {
    console.error('Erro ao cadastrar produtor:', error);
    if (error instanceof z.ZodError) {
      const erros = error.errors.map(e => ({ field: e.path[0], message: e.message }));
      return res.status(400).json({ errors: erros });
    }
    if (error.message.includes('Unique constraint failed')) {
      return res.status(400).json({ errors: [{ field: 'email', message: 'Email ou CPF já cadastrado' }] });
    }
    return res.status(500).json({ errors: [{ field: null, message: 'Erro interno ao cadastrar produtor' }] });
  }
});

// ========================
// CADASTRAR EMPRESÁRIO
// ========================
router.post('/empresario', async (req, res) => {
  const schema = z.object({
    nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    telefone: z.string().optional(),
    cnpj: z.string(),
  });

  try {
    const parsed = schema.parse(req.body);
    const novoEmpresario = await prisma.empresario.create({ data: parsed });
    res.status(201).json({ message: 'Empresário cadastrado com sucesso', empresario: novoEmpresario });
  } catch (error) {
    console.error('Erro ao cadastrar empresário:', error);
    if (error instanceof z.ZodError) {
      const erros = error.errors.map(e => ({ field: e.path[0], message: e.message }));
      return res.status(400).json({ errors: erros });
    }
    if (error.message.includes('Unique constraint failed')) {
      return res.status(400).json({ errors: [{ field: 'email', message: 'Email ou CNPJ já cadastrado' }] });
    }
    return res.status(500).json({ errors: [{ field: null, message: 'Erro interno ao cadastrar empresário' }] });
  }
});

// ========================
// LISTAR PRODUTOS
// ========================
router.get('/produtos', isAuthenticated, async (req, res) => {
  try {
    const produtos = await prisma.produto.findMany({ include: { produtor: true } });
    res.json(produtos);
  } catch (error) {
    console.error('Erro ao listar produtos:', error);
    res.status(500).json({ errors: [{ field: null, message: 'Não foi possível listar os produtos' }] });
  }
});

// ========================
// CADASTRAR PRODUTO COM UPLOAD
// ========================
router.post('/produtos', isAuthenticated, upload.single('imagem'), async (req, res) => {
  try {
    const { descricao, tipo, preco, validade, cod_produtor } = req.body;
    const imagem = req.file ? req.file.filename : null;

    if (!descricao || !tipo || !preco || !validade || !cod_produtor) {
      return res.status(400).json({ errors: [{ field: null, message: 'Dados incompletos' }] });
    }

    const novoProduto = await prisma.produto.create({
      data: {
        descricao,
        tipo,
        preco: parseFloat(preco),
        validade,
        imagem,
        cod_produtor: parseInt(cod_produtor),
      },
    });

    res.status(201).json(novoProduto);
  } catch (error) {
    console.error('Erro ao cadastrar produto:', error);
    res.status(500).json({ errors: [{ field: null, message: 'Erro interno ao cadastrar produto' }] });
  }
});
router.post('/perfil', isAuthenticated, upload.single('foto'), async (req, res) => {
  try {
    const userId = req.userId; // vem do middleware

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    if (!req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ error: 'Arquivo enviado não é uma imagem' });
    }

    const nomeArquivo = req.file.filename;
    let usuarioAtualizado;

    // Descobrir se é produtor ou empresario antes de atualizar
    let usuario = await prisma.produtor.findUnique({ where: { id: userId } });
    let tipo = 'produtor';

    if (!usuario) {
      usuario = await prisma.Empresario.findUnique({ where: { id: userId } });
      tipo = 'empresario';
    }

    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Atualizar foto
    if (tipo === 'produtor') {
      usuarioAtualizado = await prisma.produtor.update({
        where: { id: userId },
        data: { foto: nomeArquivo },
      });
    } else if (tipo === 'empresario') {
      usuarioAtualizado = await prisma.Empresario.update({
        where: { id: userId },
        data: { foto: nomeArquivo },
      });
    }

    // Remove senha antes de enviar
    if (usuarioAtualizado.senha) delete usuarioAtualizado.senha;

    res.json({
      message: 'Foto de perfil atualizada com sucesso',
      usuario: usuarioAtualizado,
    });

  } catch (error) {
    console.error('Erro ao atualizar foto de perfil:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar foto de perfil' });
  }
});

router.get('/perfil', isAuthenticated, async (req, res) => {
  try {
    const userId = req.userId; // usa o que já existe no middleware
    let usuario;

    // Primeiro tenta achar como produtor
    usuario = await prisma.produtor.findUnique({ where: { id: userId } });

    // Se não for produtor, tenta como empresário
    if (!usuario) {
      usuario = await prisma.Empresario.findUnique({ where: { id: userId } });
    }

    if (!usuario) return res.status(404).json({ error: 'Usuário não encontrado' });

    // Remove senha antes de enviar
    if (usuario.senha) delete usuario.senha;

    res.json(usuario);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro interno ao buscar perfil' });
  }
});


// ========================
// 404 e tratamento global
// ========================
router.use((req, res) => res.status(404).json({ errors: [{ field: null, message: 'Rota não encontrada' }] }));
router.use((error, req, res, next) => {
  console.error('Erro global:', error);
  res.status(500).json({ errors: [{ field: null, message: 'Erro interno no servidor' }] });
});

export default router;

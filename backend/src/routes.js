import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from './generated/prisma/client.js';
import { z } from 'zod';
import { isAuthenticated } from './middleware/autentico.js';

const router = express.Router();
const prisma = new PrismaClient();

// ========================
// LOGIN (JWT)
// ========================
router.post('/login', async (req, res) => {
  const loginSchema = z.object({
    email: z.string().email('Email inválido'),
    senha: z.string().min(4, 'Senha deve ter pelo menos 4 caracteres'),
  });

  try {
    const parsed = loginSchema.parse(req.body);
    const { email, senha } = parsed;

    // Produtor
    const produtor = await prisma.produtor.findFirst({ where: { email, senha } });
    if (produtor) {
      const token = jwt.sign({ userId: produtor.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({
        message: 'Login realizado com sucesso',
        tipo: 'produtor',
        usuario: { id: produtor.id, nome: produtor.nome, email: produtor.email },
        token,
      });
    }

    // Empresário
    const empresario = await prisma.empresario.findFirst({ where: { email, senha } });
    if (empresario) {
      const token = jwt.sign({ userId: empresario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.status(200).json({
        message: 'Login realizado com sucesso',
        tipo: 'empresario',
        usuario: { id: empresario.id, nome: empresario.nome, email: empresario.email },
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
  const produtorSchema = z.object({
    nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    telefone: z.string().min(8, 'Telefone inválido').optional(),
    cpf: z.string().min(11, 'CPF inválido').optional(),
  });

  try {
    const parsed = produtorSchema.parse(req.body);

    const novoProdutor = await prisma.produtor.create({
      data: {
        nome: parsed.nome,
        email: parsed.email,
        senha: parsed.senha,
        telefone: parsed.telefone || null,
        cpf: parsed.cpf || null,
      },
    });

    res.status(201).json({
      message: 'Produtor cadastrado com sucesso!',
      produtor: novoProdutor,
    });

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
  const empresarioSchema = z.object({
    nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    senha: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
    telefone: z.string().min(8, 'Telefone inválido').optional(),
    cnpj: z.string().min(14, 'CNPJ inválido'), // obrigatório
  });

  try {
    const parsed = empresarioSchema.parse(req.body);

    const novoEmpresario = await prisma.empresario.create({
      data: {
        nome: parsed.nome,
        email: parsed.email,
        senha: parsed.senha,
        telefone: parsed.telefone || null,
        cnpj: parsed.cnpj, // obrigatório
      },
    });

    res.status(201).json({
      message: 'Empresário cadastrado com sucesso!',
      empresario: novoEmpresario,
    });

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
    console.error('Erro na rota /produtos:', error);
    res.status(500).json({ errors: [{ field: null, message: 'Não foi possível listar os produtos' }] });
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
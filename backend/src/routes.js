import express from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from './generated/prisma/client.js';
import { isAuthenticated } from './middleware/autentico.js';

const router = express.Router();
const prisma = new PrismaClient();

// ========================
// POST login (gera JWT)
// ========================
router.post('/login', async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ error: 'Email e senha são obrigatórios' });

    try {
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
        res.status(500).json({ error: error.message });
    }
});

// ========================
// GET produtos (rota protegida)
// ========================
router.get('/produtos', isAuthenticated, async (req, res) => {
    try {
        const produtos = await prisma.produto.findMany({ include: { produtor: true } });
        res.json(produtos);
    } catch (error) {
        console.error('Erro na rota /produtos:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
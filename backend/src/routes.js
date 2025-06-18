import express from 'express';
import { produtos } from './database/produtinhos.js';
 
class HttpError extends Error {
  constructor(message, code = 400) {
    super(message);
    this.code = code;
  }
}
 
const router = express.Router();
 
router.post('/produtinhos', (req, res) => {
  const { nome, tipo } = req.body;
 
  if (!nome || !tipo) {
    throw new HttpError('Error when passing parameters');
  }
 
  const newprodutos = { nome, tipo, id };
 
  produtos.push(newprodutos);
 
  return res.status(201).json(newprodutos);
});
 
router.get('/produtinhos', (req, res) => {
  const { nome } = req.query;
 
  if (nome) {
    const filteredprodutos = produtos.filter((produtos) =>
      produtos.nome.includes(nome)
    );
 
    return res.json(filteredprodutos);
  }
 
  return res.json(produtos);
});
 
router.get('/produtos/:id', (req, res) => {
  const id = req.params.id;
 
  const index = produtos.findIndex((produtos) => produtos.id === id);
 
  if (!produtos[index]) {
    throw new HttpError('produtos not found', 404);
  }
 
  return res.json(produtos[index]);
});
 
router.put('/produtos/:id', (req, res) => {
  const { nome, tipo } = req.body;
 
  const { id } = req.params;
 
  if (!nome || !tipo) {
    throw new HttpError('Error when passing parameters');
  }
 
  const newprodutos = { nome, tipo, id };
 
  const index = produtos.findIndex((produtos) => produtos.id === id);
 
  if (!produtos[index]) {
    throw new HttpError('produtos not found', 404);
  }
 
  produtos[index] = newprodutos;
 
  return res.json(newprodutos);
});
 
router.delete('/produtos/:id', (req, res) => {
  const { id } = req.params;
 
  const index = produtos.findIndex((produtos) => produtos.id === id);
 
  if (!produtos[index]) {
    throw new HttpError('produtos not found', 404);
  }
 
  produtos.splice(index, 1);
 
  return res.sendStatus(204);
});
 
// 404 handler
router.use((req, res, next) => {
  res.status(404).json({ message: 'Content not found!' });
});
 
// Error handler
router.use((err, req, res, next) => {
  // console.error(err.stack);
 
  if (err instanceof HttpError) {
    return res.status(err.code).json({ message: err.message });
  }
 
  return res.status(500).json({ message: 'Something broke!' });
});
 
export default router;
 
import { describe, it, before } from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import crypto from 'crypto';
import app from '../src/app.js';

let token;
let produtorId;

function createProdutor() {
  const hash = crypto.randomBytes(8).toString('hex');
  return {
    nome: `Produtor ${hash}`,
    email: `produtor-${hash}@email.com`,
    senha: '123456',
    telefone: '11999999999',
    cpf: hash
  };
}

describe('Testes de Rotas - AgroViva', () => {
  let produtor;

  before(() => {
    produtor = createProdutor();
  });

  // ========================
  // PRODUTOR
  // ========================
  describe('POST /api/produtor', () => {

    it('deve cadastrar um produtor com sucesso', async () => {
      const res = await request(app)
        .post('/api/produtor')
        .send(produtor);

      assert.strictEqual(res.statusCode, 201);
      produtorId = res.body.produtor.id;
    });

    it('não deve cadastrar produtor com email duplicado', async () => {
      // Mantemos mesmo email para testar duplicidade, mas alteramos CPF
      const produtorDuplicado = {
        ...produtor,
        cpf: crypto.randomBytes(8).toString('hex')
      };

      const res = await request(app)
        .post('/api/produtor')
        .send(produtorDuplicado);

      // Esperamos status de erro por duplicidade
      assert.ok([400, 409].includes(res.statusCode), 'Deveria retornar erro de duplicidade');
    });

  });

  // ========================
  // LOGIN
  // ========================
  describe('POST /api/login', () => {

    it('deve realizar login com sucesso', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: produtor.email,
          senha: produtor.senha
        });

      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.body.token);
      token = res.body.token;
    });

    it('não deve logar com senha inválida', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: produtor.email,
          senha: 'errada'
        });

      assert.strictEqual(res.statusCode, 401);
    });

  });

  // ========================
  // PRODUTOS
  // ========================
  describe('GET /api/produtos', () => {

    it('não deve listar produtos sem autenticação', async () => {
      const res = await request(app).get('/api/produtos');
      assert.strictEqual(res.statusCode, 401);
    });

    it('deve listar produtos com token válido', async () => {
      const res = await request(app)
        .get('/api/produtos')
        .set('Authorization', `Bearer ${token}`);

      assert.strictEqual(res.statusCode, 200);
    });

  });

  describe('POST /api/produtos', () => {

    it('não deve cadastrar produto com dados incompletos', async () => {
      const res = await request(app)
        .post('/api/produtos')
        .set('Authorization', `Bearer ${token}`)
        .send({ descricao: 'Produto teste' });

      assert.strictEqual(res.statusCode, 400);
    });

  });

});

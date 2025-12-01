import nodemailer from 'nodemailer';
import mailConfig from '../config/mail.js';
import { PrismaClient } from '../generated/prisma/client.js';

const prisma = new PrismaClient();

async function createNewUser(id) {
  try {
    // Tenta como produtor
    let user = await prisma.produtor.findUnique({ where: { id } });

    // Se não for produtor, tenta como empresário
    if (!user) {
      user = await prisma.empresario.findUnique({ where: { id } });
    }

    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    const config = await mailConfig();
    const transporter = nodemailer.createTransport(config);

    const info = await transporter.sendMail({
      from: 'noreply@email.com',
      to: user.email,
      subject: 'Conta criada no AgroViva',
      html: `<h2>Conta criada com sucesso!</h2>`,
    });

    console.log(`Email enviado: ${nodemailer.getTestMessageUrl(info)}`);
  } catch (err) {
    console.error('Erro ao enviar email:', err);
  }
}

async function createNewProduct(produto) {
  try {
    // Busca o produtor correto
    const produtor = await prisma.produtor.findUnique({
      where: { id: produto.cod_produtor },
    });

    const to = produtor?.email || 'admin@empresa.com';

    const config = await mailConfig();
    const transporter = nodemailer.createTransport(config);

    const info = await transporter.sendMail({
      from: 'noreply@email.com',
      to,
      subject: 'Novo produto cadastrado no AgroViva',
      html: `
        <h2>Novo produto cadastrado:</h2>
        <p><strong>Descrição:</strong> ${produto.descricao}</p>
        <p><strong>Tipo:</strong> ${produto.tipo}</p>
        <p><strong>Preço:</strong> R$ ${produto.preco}</p>
        <p><strong>Validade:</strong> ${produto.validade}</p>
      `,
    });

    console.log(`Email enviado: ${nodemailer.getTestMessageUrl(info)}`);
  } catch (err) {
    console.error('Erro ao enviar email de novo produto:', err);
  }
}

export default { createNewUser, createNewProduct };

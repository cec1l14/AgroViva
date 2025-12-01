import nodemailer from 'nodemailer';
import mailConfig from '../config/mail.js';

async function createNewUser(to) {
  try {
    const config = await mailConfig();
    const transporter = nodemailer.createTransport(config);

    const info = await transporter.sendMail({
      from: 'noreply@email.com',
      to,
      subject: 'Conta criada no AgroViva',
      html: `<h2>Conta criada com sucesso!</h2>`,
    });

    console.log(`Email enviado para ${to}: ${nodemailer.getTestMessageUrl(info)}`);
  } catch (err) {
    console.error('Erro ao enviar email:', err);
    throw new Error(err);
  }
}

async function createNewProduct(produto) {
  try {
    const config = await mailConfig();
    const transporter = nodemailer.createTransport(config);

    const info = await transporter.sendMail({
      from: 'noreply@email.com',
      to: 'seu-email@empresa.com',  // Altere para o e-mail que você quer receber a notificação
      subject: 'Novo produto cadastrado no AgroViva',
      html: `
        <h2>Novo produto cadastrado:</h2>
        <p><strong>Descrição:</strong> ${produto.descricao}</p>
        <p><strong>Tipo:</strong> ${produto.tipo}</p>
        <p><strong>Preço:</strong> R$ ${produto.preco}</p>
        <p><strong>Validade:</strong> ${produto.validade}</p>
      `,
    });

    console.log(`Email enviado sobre novo produto: ${nodemailer.getTestMessageUrl(info)}`);
  } catch (err) {
    console.error('Erro ao enviar email de novo produto:', err);
    throw new Error('Erro ao enviar e-mail de novo produto.');
  }
}

export default { createNewUser, createNewProduct };
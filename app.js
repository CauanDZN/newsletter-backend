const express = require('express');
const cors = require('cors');
const sequelize = require('./db');
const Funcionario = require('./models/Funcionario');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Conexão com o banco de dados PostgreSQL estabelecida com sucesso.');
    console.log('Modelos sincronizados com o banco de dados.');
  } catch (error) {
    console.error('Erro ao sincronizar modelos:', error);
  }
})();

app.get('/funcionarios', async (req, res) => {
  try {
    const funcionarios = await Funcionario.findAll();
    res.json(funcionarios);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

app.post('/funcionarios', async (req, res) => {
  const { nome, email } = req.body;
  
  try {
    const usuario = await Funcionario.create({ nome, email });
    res.status(201).json({ message: 'Usuário criado com sucesso', usuario });

    enviarEmailNovoUsuario(nome, email);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

async function enviarEmailNovoUsuario(nome, email) {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: '"Seu Nome" <seuemail@gmail.com>',
      to: email,
      subject: 'Bem-vindo ao nosso serviço',
      text: `Olá ${nome}, seja bem-vindo!`,
      html: `<p>Olá ${nome}, seja bem-vindo!</p>`,
    });

    console.log('E-mail enviado: %s', info.messageId);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
  }
}

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor Express rodando na porta ${PORT}`);
});

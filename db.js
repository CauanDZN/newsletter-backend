require('dotenv').config();

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  database: process.env.PG_DB,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexão com o banco de dados PostgreSQL estabelecida com sucesso.');
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
  }
})();

module.exports = sequelize;

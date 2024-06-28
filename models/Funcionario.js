const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Funcionario = sequelize.define('funcionario', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Funcionario;

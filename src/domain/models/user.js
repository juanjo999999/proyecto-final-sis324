const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/db/database'); // Ruta corregida a database.js

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre es obligatorio.' },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Debe ser un correo electrónico válido.' },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La contraseña es obligatoria.' },
    },
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    allowNull: false,
    defaultValue: 'user', // Por defecto, los usuarios son clientes normales
  },
}, {
  timestamps: true, // Agrega createdAt y updatedAt
  tableName: 'users', // Nombre de la tabla en la base de datos
});

module.exports = User;

const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/db/database'); // Importar la conexión de Sequelize

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre del producto es obligatorio.' },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'La descripción del producto es obligatoria.' },
    },
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      isFloat: { msg: 'El precio debe ser un número válido.' },
      min: { args: [0], msg: 'El precio debe ser mayor o igual a 0.' },
    },
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: { msg: 'El stock debe ser un número entero.' },
      min: { args: [0], msg: 'El stock debe ser mayor o igual a 0.' },
    },
  },
}, {
  timestamps: true, // createdAt y updatedAt
  tableName: 'products', // Nombre de la tabla en la base de datos
});

module.exports = Product;

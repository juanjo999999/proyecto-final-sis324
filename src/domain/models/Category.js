const { DataTypes } = require('sequelize');
const sequelize = require('../../infrastructure/db/database'); // Importar la conexión de Sequelize

const Category = sequelize.define(
  'Category',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Asegurarse de que no haya nombres duplicados
      validate: {
        notEmpty: {
          msg: 'El nombre de la categoría no puede estar vacío.',
        },
        len: {
          args: [3, 50],
          msg: 'El nombre de la categoría debe tener entre 3 y 50 caracteres.',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true, // La descripción es opcional
      validate: {
        len: {
          args: [0, 255],
          msg: 'La descripción no puede exceder los 255 caracteres.',
        },
      },
    },
  },
  {
    timestamps: true, // createdAt y updatedAt
    tableName: 'categories', // Nombre de la tabla en la base de datos
    hooks: {
      beforeCreate: (category) => {
        // Limpieza de datos: eliminar espacios adicionales
        category.name = category.name.trim();
        if (category.description) {
          category.description = category.description.trim();
        }
      },
    },
  }
);

module.exports = Category;

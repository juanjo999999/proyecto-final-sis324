const { Sequelize } = require('sequelize');

// Configuración de Sequelize con SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite', // Motor de base de datos SQLite
  storage: './database.sqlite', // Ubicación del archivo SQLite
  logging: false, // Desactiva los logs SQL
});

// Verificar conexión con la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('Conexión exitosa a la base de datos.');
  })
  .catch((error) => {
    console.error('Error al conectar con la base de datos:', error);
  });

module.exports = sequelize;

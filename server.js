require('dotenv').config(); // Cargar variables de entorno
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const sequelize = require('./src/infrastructure/db/database'); // Importar correctamente la conexión

const app = express();

const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const productRoutes = require('./src/infrastructure/routes/productRoutes');
const categoryRoutes = require('./src/infrastructure/routes/categoryRoutes');
const userRoutes = require('./src/infrastructure/routes/userRoutes');

// Load routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes); // Añadido correctamente

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada.' });
});

// Manejo de errores globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Ocurrió un error en el servidor.', error: err.message });
});

// Sync database and start server
sequelize.sync({ force: false }) // Cambia a true para reiniciar la base de datos
  .then(() => {
    console.log('Base de datos conectada exitosamente.');
    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('No se pudo conectar con la base de datos:', error);
  });

module.exports = app;

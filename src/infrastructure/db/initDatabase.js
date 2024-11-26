const sequelize = require('./database'); // Conexión de la base de datos
const User = require('../../domain/models/user'); // Modelo de usuario
const Product = require('../../domain/models/Product'); // Modelo de producto
const Category = require('../../domain/models/Category'); // Modelo de categoría
const relations = require('../../domain/models/relations'); // Relacionar modelos

// Sincronizar la base de datos
const initializeDatabase = async () => {
  try {
    // Configurar relaciones
    relations();

    // Sincronizar todos los modelos
    await sequelize.sync({ force: true }); // `force: true` elimina y recrea las tablas
    console.log('Base de datos sincronizada correctamente.');

    // Opcional: Crear datos iniciales
    await seedDatabase();
  } catch (error) {
    console.error('Error al sincronizar la base de datos:', error);
  }
};

// Función para sembrar datos iniciales
const seedDatabase = async () => {
  try {
    // Crear categorías de ejemplo
    const categories = await Category.bulkCreate([
      { name: 'Electrónica', description: 'Dispositivos electrónicos y más' },
      { name: 'Hogar', description: 'Productos para el hogar y la cocina' },
    ]);

    // Crear un producto de ejemplo
    await Product.create({
      name: 'Smartphone',
      description: 'Teléfono inteligente de última generación',
      price: 699.99,
      stock: 50,
      CategoryId: categories[0].id, // Asociado a la categoría "Electrónica"
    });

    // Crear un usuario de ejemplo (admin)
    await User.create({
      name: 'Administrador',
      email: 'admin@ecommerce.com',
      password: await bcrypt.hash('admin123', 10), // Contraseña encriptada
      role: 'admin',
    });

    console.log('Datos iniciales creados correctamente.');
  } catch (error) {
    console.error('Error al sembrar datos iniciales:', error);
  }
};

// Ejecutar la inicialización
initializeDatabase();

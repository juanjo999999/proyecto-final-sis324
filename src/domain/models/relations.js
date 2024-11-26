const Product = require('./Product');
const Category = require('./Category');

// Relación: Una categoría tiene muchos productos
Category.hasMany(Product, {
  foreignKey: 'categoryId',
  as: 'products', // Alias único para acceder a los productos de una categoría
  onDelete: 'CASCADE', // Elimina los productos asociados si se elimina la categoría
});

// Relación: Un producto pertenece a una categoría
Product.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category', // Alias único para acceder a la categoría de un producto
});

module.exports = { Product, Category };

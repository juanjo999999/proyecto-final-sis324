const express = require('express');
const Category = require('../../domain/models/Category');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware para autenticar y verificar roles

const router = express.Router();

// GET: Obtener todas las categorías (accesible para todos)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener categorías.', error });
  }
});

// POST: Crear una nueva categoría (solo para administradores)
router.post('/', authMiddleware.authenticateToken, authMiddleware.isAdmin, async (req, res) => {
  try {
    const { name, description } = req.body;

    const newCategory = await Category.create({
      name,
      description,
    });

    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la categoría.', error });
  }
});

// PUT: Actualizar una categoría existente (solo para administradores)
router.put('/:id', authMiddleware.authenticateToken, authMiddleware.isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada.' });
    }

    await category.update({
      name,
      description,
    });

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la categoría.', error });
  }
});

// DELETE: Eliminar una categoría (solo para administradores)
router.delete('/:id', authMiddleware.authenticateToken, authMiddleware.isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada.' });
    }

    await category.destroy();

    res.json({ message: 'Categoría eliminada con éxito.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la categoría.', error });
  }
});

module.exports = router;

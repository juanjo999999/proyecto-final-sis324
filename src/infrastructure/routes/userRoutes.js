const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware para autenticar y verificar roles

// Ruta para registrar un nuevo usuario
router.post('/register', userController.registerUser);

// Ruta para iniciar sesión
router.post('/login', userController.loginUser);

// Ruta para verificar el usuario autenticado
router.get('/verify', authMiddleware.authenticateToken, userController.verifyUser);

// Ruta para obtener todos los usuarios (solo para administrador)
router.get('/', authMiddleware.authenticateToken, authMiddleware.isAdmin, userController.getAllUsers);

// Ruta para eliminar un usuario (solo para administrador)
router.delete('/:id', authMiddleware.authenticateToken, authMiddleware.isAdmin, userController.deleteUser);


module.exports = router;

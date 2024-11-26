const User = require('../../domain/models/user'); // Ruta correcta al modelo de usuario
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Registrar un nuevo usuario
exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Verificar que no exista un usuario con el mismo correo
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo ya está registrado.' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user', // Por defecto, el rol será "user"
    });

    res.status(201).json({ 
      message: 'Usuario registrado exitosamente.', 
      user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role }
    });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Error al registrar el usuario. Inténtalo más tarde.' });
  }
};

// Iniciar sesión
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Verificar que el usuario exista
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    }

    // Comparar contraseñas
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    }

    // Generar un token JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET || 'secreto',
      { expiresIn: '1h' }
    );

    res.status(200).json({ 
      message: 'Inicio de sesión exitoso.', 
      token, 
      user: { name: user.name, role: user.role }
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión. Inténtalo más tarde.' });
  }
};

// Obtener todos los usuarios (solo para administrador)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }, // Excluir la contraseña de los resultados
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios.' });
  }
};

// Eliminar un usuario (solo para administrador)
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    await user.destroy();
    res.status(200).json({ message: 'Usuario eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error al eliminar el usuario.' });
  }
};


exports.verifyUser = (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No autorizado.' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
      res.status(200).json({ id: decoded.id, name: decoded.name, role: decoded.role });
    } catch (error) {
      console.error('Error al verificar el token:', error);
      res.status(401).json({ message: 'Token inválido.' });
    }
  };
  
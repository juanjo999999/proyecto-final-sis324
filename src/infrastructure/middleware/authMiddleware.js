const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Auth Header:', authHeader);

  if (!authHeader) {
    console.log('No authorization header found');
    return res.status(401).json({ message: 'No autorizado. Token no proporcionado.' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token extracted:', token.substring(0, 20) + '...');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto');
    console.log('Decoded token:', { userId: decoded.id, role: decoded.role });
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error al verificar el token:', error);
    res.status(403).json({ message: 'Token inválido o expirado.' });
  }
};

exports.isAdmin = (req, res, next) => {
  console.log('User object in isAdmin:', req.user);

  if (!req.user) {
    console.log('No user object found in request');
    return res.status(403).json({ message: 'No autorizado. Usuario no encontrado.' });
  }

  if (req.user.role !== 'admin') {
    console.log(`User role is ${req.user.role}, expected admin`);
    return res.status(403).json({ message: 'No autorizado. Se requiere rol de administrador.' });
  }

  console.log('Admin authorization successful');
  next();
};
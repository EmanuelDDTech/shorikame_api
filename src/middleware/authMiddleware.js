import jwt from 'jsonwebtoken';
import { User } from '#modules/user/models/User.js';

const authMiddleware = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findByPk(decoded.id, {
        attributes: ['id', 'name', 'email', 'isAdmin'],
      });

      next();
    } catch {
      const error = new Error('Token no válido');
      return res.status(403).json({ msg: error.message });
    }
  } else {
    const error = new Error('Token no válido o inexistente');
    return res.status(403).json({ msg: error.message });
  }
};

export default authMiddleware;

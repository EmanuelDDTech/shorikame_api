import { User } from '../models/User.js';

const getUsers = async (req, res) => {
  const users = await User.findAll();
  return res.json(users);
};

const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ msg: 'Internal server error' });
  }
};

const createUser = async (req, res) => {
  if (Object.values(req.body).includes('')) {
    const error = new Error('Todos los campos son obligatorios');
    return res.status(400).json({ msg: error.message });
  }

  const { email, password } = req.body;

  try {
    // Validar la extensión del password
    const MIN_PASSWORD_LENGTH = 8;

    if (password?.trim().length < MIN_PASSWORD_LENGTH) {
      const error = new Error(`El password debe contener ${MIN_PASSWORD_LENGTH} caracteres`);
      return res.status(400).json({ msg: error.message });
    }

    const newUser = await User.create({ email, password });

    return res.json(newUser);
  } catch (error) {
    if (error?.original.code === '23505') {
      console.log('El correo ya existe');
      return res.status(409).json({ msg: 'El correo ya existe' });
    }

    return res.status(500).json({ msg: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await User.destroy({
      where: {
        id,
      },
    });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, verified, token } = req.body;

  try {
    const user = await User.findByPk(id);

    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    user.name = name;
    user.verified = verified;
    user.token = token;

    await user.save();

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export { getUsers, getUserById, createUser, deleteUser, updateUser };

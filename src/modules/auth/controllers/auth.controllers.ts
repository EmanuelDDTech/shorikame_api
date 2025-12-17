import { User } from '#modules/user/models/User.js';
import { hashPassword, checkPassword, generateJWT } from '#src/utils/index';
import { sendEmailVerification } from '#src/emails/authEmailService.js';
import { OAuth2Client } from 'google-auth-library';
import { Request, Response } from 'express';
import { AuthRequest } from '../interfaces';

const client = new OAuth2Client(
  '409428805948-oabs342a3r6b7e21q6922d5buubkiph0.apps.googleusercontent.com',
);

const sendUser = async (req: AuthRequest, res: Response) => {
  const { user } = req;
  if (!user) {
    const error = new Error('Token no válido');
    return res.status(403).json({ msg: error.message });
  }
  return res.json(user);
};

const sendAdmin = async (req: AuthRequest, res: Response) => {
  const { user } = req;
  if (!user?.isAdmin) {
    const error = new Error('Acción no válida');
    return res.status(403).json({ msg: error.message });
  }
  return res.json(user);
};

const register = async (req: Request, res: Response) => {
  if (Object.values(req.body).includes('')) {
    const error = new Error('Todos los campos son obligatorios');
    return res.status(400).json({ msg: error.message });
  }

  const { name, email, password } = req.body;

  try {
    // Validar la extensión del password
    const MIN_PASSWORD_LENGTH = 8;

    if (password?.trim().length < MIN_PASSWORD_LENGTH) {
      const error = new Error(`El password debe contener ${MIN_PASSWORD_LENGTH} caracteres`);
      return res.status(400).json({ msg: error.message });
    }

    const hashPass = await hashPassword(password);
    const newUser = await User.create({ name, email, password: hashPass });

    await sendEmailVerification({ name: newUser.name, email: newUser.email, token: newUser.token });

    return res.json({ msg: 'Revisa el correo que te enviamos para la verificación de la cuenta.' });
  } catch (error: any) {
    if (error?.original.code === '23505') {
      return res.status(409).json({ msg: 'El correo ya existe' });
    }

    return res.status(500).json({ msg: 'Internal server error' });
  }
};

const verifyAccount = async (req: Request, res: Response) => {
  const { token } = req.params;
  const user = await User.findOne({ where: { token } });

  if (!user) {
    const error = new Error('Hubo un error, token no válido');
    return res.status(401).json({ msg: error.message });
  }

  try {
    user.verified = true;
    user.token = '';
    await user.save();
    return res.json({ msg: 'Usuario confirmado correctamente' });
  } catch (error) {
    console.log(error);
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (!user) {
    const error = new Error('El usuario no existe');
    return res.status(401).json({ msg: error.message });
  }

  if (!user.verified) {
    const error = new Error('La cuenta no ha sido confirmada aún');
    return res.status(401).json({ msg: error.message });
  }

  const correctPassword = await checkPassword(password, user.password);

  if (!correctPassword) {
    const error = new Error('La contraseña es incorrecta');
    return res.status(401).json({ msg: error.message });
  }

  const token = generateJWT(user.id);
  return res.json({ token });
};

const googleLogin = async (req: Request, res: Response) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: '409428805948-oabs342a3r6b7e21q6922d5buubkiph0.apps.googleusercontent.com',
    });

    const payload = ticket.getPayload();
    const user = await User.findOne({ where: { email: payload?.email } });

    if (user) {
      const token = generateJWT(user.id);
      return res.json({ token });
    } else {
      const uniqueId = Date.now().toString(32) + Math.random().toString(32).substring(2);
      const password = await hashPassword(uniqueId);
      const newUser = await User.create({
        name: payload?.name,
        email: payload?.email,
        password,
        verified: true,
      });

      const token = generateJWT(newUser.id);
      return res.json({ token });
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return res.status(401).json({ msg });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await User.destroy({
      where: {
        id,
      },
    });

    return res.sendStatus(204);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg });
  }
};

const updateUser = async (req: Request, res: Response) => {
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
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return res.status(500).json({ msg });
  }
};

export { sendUser, register, deleteUser, updateUser, verifyAccount, login, googleLogin, sendAdmin };

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Response } from 'express';

function handleNotFoundError(message: string, res: Response) {
  const error = new Error(message);

  return res.status(404).json({
    msg: error.message,
  });
}

const uniqueId = () => Date.now().toString(32) + Math.random().toString(32).substring(2);

const hashPassword = async (pass: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(pass, salt);
};

const checkPassword = async (inputPassword: string, userPassword: string) => {
  return await bcrypt.compare(inputPassword, userPassword);
};

const generateJWT = (id: string | number) => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET no definido');
  }

  const token = jwt.sign({ id }, jwtSecret, {
    expiresIn: '30d',
  });

  return token;
};

export { handleNotFoundError, uniqueId, hashPassword, checkPassword, generateJWT };

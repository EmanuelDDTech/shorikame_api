import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

function handleNotFoundError(message, res) {
  const error = new Error(message);

  return res.status(404).json({
    msg: error.message,
  });
}

const uniqueId = () => Date.now().toString(32) + Math.random().toString(32).substring(2);

const hashPassword = async (pass) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(pass, salt);
};

const checkPassword = async (inputPassword, userPassword) => {
  return await bcrypt.compare(inputPassword, userPassword);
};

const generateJWT = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  return token;
};

export { handleNotFoundError, uniqueId, hashPassword, checkPassword, generateJWT };

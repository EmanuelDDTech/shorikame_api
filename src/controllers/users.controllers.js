import { pool } from '../db.js';

const getUsers = async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM users');
  return res.json(rows);
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  const { rows } = await pool.query(`SELECT * FROM users WHERE id = ${id}`);

  if (rows.length === 0) return res.status(404).json({ msg: 'Usuario no encontrado' });
  return res.json(rows[0]);
};

const createUser = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);

    const { rows } = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [data.name, data.email],
    );

    return res.json(rows[0]);
  } catch (error) {
    if (error?.code === '23505') {
      return res.status(409).json({ msg: 'El correo ya existe' });
    }

    return res.status(500).json({ msg: 'Internal server error' });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const { rowCount } = await pool.query(`DELETE FROM users WHERE id = ${id} RETURNING *`);

  if (rowCount === 0) return res.status(404).json({ msg: 'Usuario no encontrado' });
  return res.sendStatus(204);
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const { rows } = await pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
    [data.name, data.email, id],
  );

  return res.json(rows[0]);
};

export { getUsers, getUserById, createUser, deleteUser, updateUser };

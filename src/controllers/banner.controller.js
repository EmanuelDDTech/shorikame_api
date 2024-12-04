import { Banner } from '../models/Banner.js';

const createBanner = async (req, res) => {
  if (Object.values(req.body).includes('')) {
    const error = new Error('Todos los campos son obligatorios');
    return res.status(400).json({ msg: error.message });
  }

  try {
    const newBanner = await Banner.create(req.body);
    return res.json(newBanner);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export { createBanner };

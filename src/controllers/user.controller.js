import { Cart } from '../models/Cart.js';
import { Product } from '../models/Product.js';
import { ProductGallery } from '../models/ProductGallery.js';
import { User } from '../models/User.js';

const getUsers = async (req, res) => {
  const { user } = req;

  if (!user) {
    const error = new Error('Token no válido');
    return res.status(403).json({ msg: error.message });
  }

  if (!user.isAdmin) {
    const error = new Error('Acción no válida');
    return res.status(403).json({ msg: error.message });
  }

  try {
    const users = await User.findAll();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getUserById = async (req, res) => {
  const { user } = req;
  const { userId } = req.params;

  if (!user) {
    const error = new Error('Token no válido');
    return res.status(403).json({ msg: error.message });
  }

  if (!user.isAdmin) {
    const error = new Error('Acción no válida');
    return res.status(403).json({ msg: error.message });
  }

  try {
    const user = await User.findOne({
      where: { id: userId },
      attributes: ['id', 'name', 'email', 'verified', 'isAdmin'],
      include: [
        {
          model: Cart,
          attributes: ['id', 'quantity'],
          include: [
            {
              model: Product,
              attributes: ['id', 'name', 'price', 'stock', 'discount', 'weight'],
              include: [
                {
                  model: ProductGallery,
                  attributes: ['id', 'order', 'url', 'product_id'],
                  where: { order: 1 },
                },
              ],
            },
          ],
        },
      ],
    });

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export { getUsers, getUserById };

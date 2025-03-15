import { FeaturedProduct } from '../models/FeaturedProduct.js';
import { Product } from '../models/Product.js';
import { ProductGallery } from '../models/ProductGallery.js';

const createFeaturedProduct = async (req, res) => {
  const { user } = req;

  if (!user.isAdmin) {
    const error = new Error('Acción no válida');
    return res.status(403).json({ msg: error.message });
  }

  if (Object.values(req.body).includes('')) {
    const error = new Error('Todos los campos son obligatorios');
    return res.status(400).json({ msg: error.message });
  }

  try {
    const featuredProduct = await FeaturedProduct.create(req.body);
    return res.json(featuredProduct);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getFeaturedProductAll = async (req, res) => {
  try {
    const featuredProducts = await FeaturedProduct.findAll({
      attributes: ['id', 'order'],
      order: [['order']],
      include: {
        model: Product,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        include: {
          model: ProductGallery,
          attributes: ['id', 'order', 'url'],
          where: { order: 1 },
        },
      },
    });

    return res.json(featuredProducts);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updateFeaturedProduct = async (req, res) => {
  const { user } = req;
  const { featured_id } = req.params;
  const { newIndex } = req.body;

  if (!newIndex && newIndex !== 0) {
    const error = new Error('newIndex es requerido');
    return res.status(400).json({ msg: error.message });
  }

  if (!Number.isInteger(newIndex)) {
    const error = new Error('newIndex tiene que ser un número entero');
    return res.status(400).json({ msg: error.message });
  }

  if (!user.isAdmin) {
    const error = new Error('Acción no válida');
    return res.status(403).json({ msg: error.message });
  }

  try {
    const featuredProduct = await FeaturedProduct.findOne({ where: { id: featured_id } });

    featuredProduct.order = newIndex;

    featuredProduct.save();

    return res.json({ msg: 'Orden actualizado correctamente' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const deleteFeaturedProduct = async (req, res) => {
  const { user } = req;
  const { featured_id } = req.params;

  if (!user.isAdmin) {
    const error = new Error('Acción no válida');
    return res.status(403).json({ msg: error.message });
  }

  try {
    await FeaturedProduct.destroy({ where: { id: featured_id } });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export {
  createFeaturedProduct,
  getFeaturedProductAll,
  updateFeaturedProduct,
  deleteFeaturedProduct,
};

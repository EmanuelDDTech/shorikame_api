import { Op } from 'sequelize';
import { ProductGallery } from '../models/ProductGallery.js';

const createProductGallery = async (req, res) => {
  if (Object.values(req.body).includes('')) {
    const error = new Error('Todos los campos son obligatorios');
    return res.status(400).json({ msg: error.message });
  }

  console.log(req.body);
  const { images, product_id } = req.body;
  const result = [];

  try {
    await Promise.all(
      images.map(async (image) => {
        image.product_id = product_id;
        const { dataValues } = await ProductGallery.create(image);
        result.push(dataValues);
      }),
    );
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getProductGalleryAll = async (req, res) => {
  const { product_id } = req.params;

  try {
    const gallery = await ProductGallery.findAll({
      where: { product_id },
      attributes: ['id', 'order', 'url', 'product_id'],
      order: [['order']],
    });
    return res.json(gallery);
  } catch (error) {}
};

const updateGallery = async (req, res) => {
  const { product_id } = req.params;
  const { gallery } = req.body;

  const galleryOrders = gallery.map((image) => {
    return image.order;
  });

  await ProductGallery.destroy({
    where: {
      product_id,
      order: { [Op.notIn]: galleryOrders },
    },
  });

  await Promise.all(
    gallery.map(async (newImage) => {
      const image = await ProductGallery.findOne({ where: { product_id, order: newImage.order } });

      if (image !== null && image !== undefined) {
        image.url = newImage.url;
        await image.save();
      } else {
        await ProductGallery.create({ product_id, order: newImage.order, url: newImage.url });
      }
    }),
  );

  return res.json({ msg: 'Galería actualizada correctamente' });
};

export { createProductGallery, getProductGalleryAll, updateGallery };

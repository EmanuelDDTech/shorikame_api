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
    });
    return res.json(gallery);
  } catch (error) {}
};

export { createProductGallery, getProductGalleryAll };

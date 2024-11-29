import { Product } from '../models/Product.js';
import { ProductGallery } from '../models/ProductGallery.js';

const createProduct = async (req, res) => {
  if (Object.values(req.body).includes('')) {
    const error = new Error('Todos los campos son obligatorios');
    return res.status(400).json({ msg: error.message });
  }

  try {
    const newProduct = await Product.create(req.body);
    return res.json(newProduct);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);

    if (!product) return res.status(404).json({ msg: 'Producto no encontrado' });
    return res.json(product);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: {
        model: ProductGallery,
        attributes: ['id', 'order', 'url', 'product_id'],
        where: { order: 1 },
      },
    });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, discount, stock, sku, product_category_id } = req.body;

  try {
    const product = await Product.findByPk(id);

    if (!product) return res.status(404).json({ msg: 'Producto no encontrado' });

    product.name = name;
    product.sku = sku;
    product.description = description;
    product.price = price;
    product.discount = discount;
    product.stock = stock;
    product.product_category_id = product_category_id;

    await product.save();

    return res.json({ msg: 'Producto actualizado correctamente' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await Product.destroy({
      where: {
        id,
      },
    });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export { createProduct, getProductById, getProducts, updateProduct, deleteProduct };

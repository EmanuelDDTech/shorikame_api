import { Op } from 'sequelize';
import { FilterValueProduct } from '#modules/filter/models/FilterValueProduct.js';
import { Product } from '#modules/product/models/Product.js';
import { ProductGallery } from '#modules/product/models/ProductGallery.js';
import { CampaignProduct } from '#modules/campaign/models/CampaignProduct.js';
import { sequelize } from '#src/database/database.js';

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
    const product = await Product.findOne({
      where: { id },
      attributes: { exclude: ['createdAt', 'updatedAt', 'discount'] },
      include: [
        {
          model: CampaignProduct,
          attributes: ['campaign_price'],
        },
        {
          model: ProductGallery,
          attributes: ['url'],
          where: { order: 1 },
        },
      ],
    });

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
      order: [['id', 'ASC']],
    });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { user } = req;
  const { id } = req.params;
  const {
    name,
    description,
    price,
    discount,
    stock,
    stock_visible,
    sku,
    product_category_id,
    weight,
    active,
  } = req.body;

  if (!user.isAdmin) {
    const error = new Error('Acción no válida');
    return res.status(403).json({ msg: error.message });
  }

  try {
    const product = await Product.findByPk(id);

    if (!product) return res.status(404).json({ msg: 'Producto no encontrado' });

    product.name = name ?? product.name;
    product.sku = sku ?? product.sky;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.discount = discount ?? product.discount;
    product.stock = stock ?? product.stock;
    product.stock_visible = stock_visible ?? product.stock_visible;
    product.product_category_id = product_category_id ?? product.product_category_id;
    product.weight = weight ?? product.weight;
    product.active = active ?? product.active;

    console.log(product);

    await product.save();

    return res.json({ msg: 'Producto actualizado correctamente' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await ProductGallery.destroy({ where: { product_id: id } });
    await FilterValueProduct.destroy({ where: { productId: id } });
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

const searchProducts = async (req, res) => {
  try {
    const query = req.query.q;
    const admin = req.query.admin;

    if (!query)
      return res.status(400).json({ error: 'Debes proporcionar un término de búsqueda.' });

    const products = await Product.findAll({
      where: sequelize.literal(
        `(similarity(name, '${query}') > 0.2 OR similarity(sku, '${query}') > 0.2) ${
          admin ? '' : 'AND active = true'
        }`,
      ),
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      include: {
        model: ProductGallery,
        attributes: ['url'],
        where: { order: 1 },
      },
    });

    return res.json(products);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export { createProduct, getProductById, getProducts, updateProduct, deleteProduct, searchProducts };

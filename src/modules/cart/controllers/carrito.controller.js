import { Cart } from '#modules/cart/models/Cart.js';
import { Product } from '#modules/product/models/Product.js';
import { ProductGallery } from '#modules/product/models/ProductGallery.js';

const getCart = async (req, res) => {
  const { id: userId } = req.user;

  try {
    const products = await Cart.findAll({
      where: { userId },
      attributes: ['id', 'quantity'],
      include: {
        model: Product,
        attributes: ['id', 'name', 'price', 'stock', 'discount', 'weight'],
        include: {
          model: ProductGallery,
          attributes: ['id', 'order', 'url', 'product_id'],
          where: { order: 1 },
        },
      },
    });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const addProduct = async (req, res) => {
  const { productId } = req.body;
  const { id: userId } = req.user;
  const quantity = 1;

  try {
    const product = await Cart.findOne({
      where: {
        productId,
        userId,
      },
    });

    if (product) return res.status(409).json({ msg: 'El producto ya está en el carrito' });

    const newProduct = await Cart.create({ productId, userId, quantity });
    return res.json(newProduct);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updateProduct = async (req, res) => {
  const { productId, quantity } = req.body;
  const { id: userId } = req.user;

  try {
    const productCart = await Cart.findOne({
      where: { productId, userId },
    });
    const product = await Product.findOne({ where: { id: productId } });

    if (!productCart) return res.status(404).json({ msg: 'El producto no existe en este carrito' });
    if (!product) return res.status(404).json({ msg: 'El producto no existe' });

    if (quantity > product.stock) {
      return res.status(409).json({ msg: 'No hay stock suficiente' });
    }

    productCart.quantity = quantity;
    await productCart.save();

    return res.json({ msg: 'Carrito actualizado correctamente' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  const { id: userId } = req.user;

  try {
    await Cart.destroy({ where: { productId, userId } });
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export { getCart, addProduct, updateProduct, deleteProduct };

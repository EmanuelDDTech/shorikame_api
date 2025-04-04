import { DiscountCode } from '../models/DiscountCode.js';

const getDiscountCodes = async (req, res) => {
  const { id: userId, isAdmin } = req.user;

  if (!isAdmin) {
    const error = new Error('Acción no válida');
    return res.status(403).json({ msg: error.message });
  }

  try {
    const discountCodes = await DiscountCode.findAll();
    return res.json(discountCodes);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const createDiscountCode = async (req, res) => {
  const { id: userId, isAdmin } = req.user;
  const discountCodeData = req.body;

  if (!isAdmin) {
    const error = new Error('Acción no válida');
    return res.status(403).json({ msg: error.message });
  }

  try {
    const discountCode = await DiscountCode.create(discountCodeData);
    return res.json(discountCode);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getDiscountCodeById = async (req, res) => {
  const { id: userId, isAdmin } = req.user;
  const { id } = req.params;

  if (!isAdmin) {
    const error = new Error('Acción no válida');
    return res.status(403).json({ msg: error.message });
  }

  try {
    const discountCode = await DiscountCode.findOne({
      where: { id },
    });

    if (!discountCode) {
      const error = new Error('Código de descuento no encontrado');
      return res.status(403).json({ msg: error.message });
    }

    return res.json(discountCode);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updateDiscountCode = async (req, res) => {
  const { id: userId, isAdmin } = req.user;
  const { id } = req.params;
  const discountCodeData = req.body;

  if (!isAdmin) {
    const error = new Error('Acción no válida');
    return res.status(403).json({ msg: error.message });
  }

  try {
    const discountCode = await DiscountCode.findOne({
      where: { id },
    });

    if (!discountCode) {
      const error = new Error('Código de descuento no encontrado');
      return res.status(403).json({ msg: error.message });
    }

    discountCode.code = discountCodeData.code ?? discountCode.code;
    discountCode.discount_type = discountCodeData.discount_type ?? discountCode.discount_type;
    discountCode.discount_value = discountCodeData.discount_value ?? discountCode.discount_value;
    discountCode.min_purchase = discountCodeData.min_purchase ?? discountCode.min_purchase;
    discountCode.max_discount = discountCodeData.max_discount ?? discountCode.max_discount;
    discountCode.usage_limit = discountCodeData.usage_limit ?? discountCode.usage_limit;
    discountCode.times_used = discountCodeData.times_used ?? discountCode.times_used;
    discountCode.expires_at = discountCodeData.expires_at ?? discountCode.expires_at;

    await discountCode.save();

    return res.json({ msg: 'Código de descuento actualizado correctamente' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const deleteDiscountCode = async (req, res) => {
  const { id: userId, isAdmin } = req.user;
  const { id } = req.params;

  if (!isAdmin) {
    const error = new Error('Acción no válida');
    return res.status(403).json({ msg: error.message });
  }

  try {
    await DiscountCode.destroy({ where: { id } });
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getDiscountCodeByCode = async (req, res) => {
  const { code } = req.params;

  try {
    const discountCode = await DiscountCode.findOne({
      where: { code: code.toUpperCase() },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    if (!discountCode) {
      const error = new Error('Código de descuento no encontrado');
      return res.status(403).json({ msg: error.message });
    }

    if (discountCode.times_used >= discountCode.usage_limit) {
      const error = new Error('Este código ya fue usado');
      return res.status(403).json({ msg: error.message });
    }

    return res.json(discountCode);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updateTimesUsed = async (req, res) => {
  const { code } = req.params;

  try {
    const discountCode = await DiscountCode.findOne({
      where: { code: code.toUpperCase() },
    });

    if (!discountCode) {
      const error = new Error('Código de descuento no encontrado');
      return res.status(403).json({ msg: error.message });
    }

    if (discountCode.times_used >= discountCode.usage_limit) {
      const error = new Error('Este código ya fue usado');
      return res.status(403).json({ msg: error.message });
    }

    discountCode.times_used = discountCode.times_used + 1;

    await discountCode.save();

    return res.json({ msg: 'Código de descuento aplicado correctamente' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export {
  getDiscountCodes,
  createDiscountCode,
  getDiscountCodeById,
  updateDiscountCode,
  deleteDiscountCode,
  getDiscountCodeByCode,
  updateTimesUsed,
};

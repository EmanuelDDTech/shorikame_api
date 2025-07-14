import { Op } from 'sequelize';
import { FilterValueProduct } from '../models/FilterValueProduct.js';

const saveFilterProduct = async (req, res) => {
  const { productId, filters } = req.body;

  try {
    const filterProducts = await FilterValueProduct.findAll({
      where: { productId, filterValueId: filters },
      attributes: ['filterValueId'],
    });

    const filterProductIds = filterProducts.map((filter) => filter.dataValues.filterValueId);

    await FilterValueProduct.destroy({
      where: {
        productId,
        filterValueId: { [Op.notIn]: filters },
      },
    });

    await Promise.all(
      filters.map(async (filterValueId) => {
        if (!filterProductIds.includes(filterValueId)) {
          await FilterValueProduct.create({ productId, filterValueId });
        }
      }),
    );

    return res.json({ msg: 'Filtros guardados correctamente' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const findByProductId = async (req, res) => {
  const { productId } = req.params;

  try {
    const filterProducts = await FilterValueProduct.findAll({
      where: { productId },
      attributes: ['filterValueId'],
    });

    const filterProductIds = filterProducts.map((filter) => filter.dataValues.filterValueId);

    return res.json(filterProductIds);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export { saveFilterProduct, findByProductId };

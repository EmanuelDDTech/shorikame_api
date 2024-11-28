import { FilterCategory } from '../models/FilterCategory.js';
import { FilterGroup } from '../models/FilterGroup.js';
import { FilterValue } from '../models/FilterValue.js';

const createFilterCategory = async (req, res) => {
  if (Object.values(req.body).includes('')) {
    const error = new Error('Todos los campos son obligatorios');
    return res.status(400).json({ msg: error.message });
  }

  const { filter_group_id, product_category_id } = req.body;

  try {
    await FilterCategory.create({ filter_group_id, product_category_id });
    return res.json({ msg: 'FilterCategory creado correctamente' });
  } catch (error) {
    console.log(error);
  }
};

const getFiltersCategory = async (req, res) => {
  const { categId } = req.params;

  if (!categId) {
    return res.status(500).json({ msg: 'Categoría inválida' });
  }

  const filtersCategory = await FilterCategory.findAll({
    where: { product_category_id: categId },
    attributes: ['id'],
    include: {
      model: FilterGroup,
      attributes: ['id', 'name'],
      include: { model: FilterValue, attributes: ['id', 'name'] },
    },
  });

  return res.json(filtersCategory);
};

const deleteFilterCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await FilterCategory.destroy({ where: { id } });
    return res.json({ msg: 'Eliminado correctamente' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export { createFilterCategory, getFiltersCategory, deleteFilterCategory };

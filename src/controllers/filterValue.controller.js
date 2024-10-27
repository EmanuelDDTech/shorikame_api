import { FilterGroup } from '../models/FilterGroup.js';
import { FilterValue } from '../models/FilterValue.js';

const createFilterValue = async (req, res) => {
  if (Object.values(req.body).includes('')) {
    const error = new Error('Todos los campos son obligatorios');
    return res.status(400).json({ msg: error.message });
  }

  const { names, filterGroupId } = req.body;

  try {
    const filterGroup = await FilterGroup.findOne({ where: { id: filterGroupId } });
    if (!filterGroup) {
      const error = new Error('El grupo de filtros no existe');
      return res.status(401).json({ msg: error.message });
    }

    if (!Array.isArray(names)) {
      const error = new Error('names debe ser un array');
      return res.status(401).json({ msg: error.message });
    }

    names.forEach(async (name) => {
      await FilterValue.create({ name, filterGroupId });
    });

    return res.json({ msg: 'Filtros creados correctamente' });
  } catch (error) {
    console.log(error);
  }
};

const getFilterValueById = async (req, res) => {
  const { id } = req.params;
  const filterValue = await FilterValue.findOne({ where: { id } });

  if (!filterValue) {
    const error = new Error('El filtro no existe');
    return res.status(401).json({ msg: error.message });
  }

  return res.json(filterValue);
};

const updateFilterValues = async (req, res) => {
  const { id } = req.params;
  const filterValue = await FilterValue.findOne({ where: { id } });

  if (!filterValue) {
    const error = new Error('El filtro no existe');
    return res.status(401).json({ msg: error.message });
  }

  filterValue.name = req.body.name || filterValue.name;
  filterValue.filterGroupId = req.body.filterGroupId || filterValue.filterGroupId;

  try {
    await filterValue.save();
    res.json({ msg: 'Filtro actualizado correctamente' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const deleteFilterValue = async (req, res) => {
  const { id } = req.params;

  try {
    await FilterValue.destroy({ where: { id } });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export { createFilterValue, getFilterValueById, updateFilterValues, deleteFilterValue };

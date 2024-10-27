import { FilterGroup } from '../models/FilterGroup.js';
import { FilterValue } from '../models/FilterValue.js';

const createFilterGroup = async (req, res) => {
  if (Object.values(req.body).includes('')) {
    const error = new Error('Todos los campos son obligatorios');
    return res.status(400).json({ msg: error.message });
  }

  const { name } = req.body;

  try {
    await FilterGroup.create({ name });
    return res.json({ msg: 'Grupo de filtro creado correctamente' });
  } catch (error) {
    console.log(error);
  }
};

const getFilterGroups = async (req, res) => {
  const filterGroups = await FilterGroup.findAll({
    attributes: ['id', 'name'],
    include: { model: FilterValue, attributes: ['id', 'name'] },
  });
  return res.json(filterGroups);
};

const getFilterGroupById = async (req, res) => {
  const { id } = req.params;
  const filterGroup = await FilterGroup.findOne({
    where: { id },
    attributes: ['id', 'name'],
    include: { model: FilterValue, attributes: ['id', 'name'] },
  });

  if (!filterGroup) {
    const error = new Error('El grupo de filtros no existe');
    return res.status(401).json({ msg: error.message });
  }

  return res.json(filterGroup);
};

const updateFilterGroup = async (req, res) => {
  const { id } = req.params;
  const filterGroup = await FilterGroup.findOne({ where: { id } });

  if (!filterGroup) {
    const error = new Error('El grupo de filtros no existe');
    return res.status(401).json({ msg: error.message });
  }

  filterGroup.name = req.body.name || filterGroup.name;

  try {
    await filterGroup.save();
    res.json({ msg: 'Grupo de filtros actualizado correctamente' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const deleteFilterGroup = async (req, res) => {
  const { id } = req.params;

  try {
    await FilterGroup.destroy({ where: { id } });
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export {
  createFilterGroup,
  getFilterGroups,
  getFilterGroupById,
  updateFilterGroup,
  deleteFilterGroup,
};

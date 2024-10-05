import { ProductCategory } from '../models/ProductCategory.js';

const createCategory = async (req, res) => {
  if (Object.values(req.body).includes('')) {
    const error = new Error('Todos los campos son obligatorios');
    return res.status(400).json({ msg: error.message });
  }

  const { name } = req.body;

  try {
    await ProductCategory.create({ name });
    return res.json({ msg: 'Categoría creada correctamente' });
  } catch (error) {
    console.log(error);
  }
};

const getCategories = async (req, res) => {
  const categories = await ProductCategory.findAll();
  return res.json(categories);
};

const getCategoryById = async (req, res) => {
  const { id } = req.params;
  const category = await ProductCategory.findOne({ where: { id } });

  if (!category) {
    const error = new Error('La categoría no existe');
    return res.status(401).json({ msg: error.message });
  }

  return res.json(category);
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const category = await ProductCategory.findOne({ where: { id } });

  if (!category) {
    const error = new Error('La categoría no existe');
    return res.status(401).json({ msg: error.message });
  }

  category.name = req.body.name || category.name;

  try {
    await category.save();
    res.json({ msg: 'Categoría actualizada correctamente' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await ProductCategory.destroy({
      where: {
        id,
      },
    });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory };

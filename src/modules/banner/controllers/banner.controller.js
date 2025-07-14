import { Banner } from '../models/Banner.js';

const createBanner = async (req, res) => {
  if (Object.values(req.body).includes('')) {
    const error = new Error('Todos los campos son obligatorios');
    return res.status(400).json({ msg: error.message });
  }

  try {
    const newBanner = await Banner.create(req.body);
    return res.json(newBanner);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getBannerAll = async (req, res) => {
  try {
    const banners = await Banner.findAll({
      attributes: ['id', 'name', 'url', 'order', 'redirect', 'start', 'end'],
      order: [['order']],
    });
    return res.json(banners);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getBannerById = async (req, res) => {
  const { id } = req.params;

  try {
    const banner = await Banner.findByPk(id);

    if (!banner) return res.status(404).json({ msg: 'Banner no encontrado' });
    return res.json(banner);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updateBanner = async (req, res) => {
  const { id } = req.params;
  const { name, url, order, redirect, start, end } = req.body;

  try {
    const banner = await Banner.findByPk(id);

    if (!banner) return res.status(404).json({ msg: 'Banner no encontrado' });

    banner.name = name;
    banner.url = url;
    banner.order = order;
    banner.redirect = redirect;
    banner.start = start;
    banner.end = end;

    await banner.save();

    return res.json({ msg: 'Banner actualizado correctamente' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const deleteBanner = async (req, res) => {
  const { id } = req.params;

  try {
    await Banner.destroy({ where: { id } });
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export { createBanner, getBannerAll, getBannerById, updateBanner, deleteBanner };

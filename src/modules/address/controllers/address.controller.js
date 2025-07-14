import { Address } from '#modules/address/models/Address.js';

const createAddress = async (req, res) => {
  if (Object.values(req.body).includes('')) {
    const error = new Error('Todos los campos son obligatorios');
    return res.status(400).json({ msg: error.message });
  }

  try {
    let { id, ...data } = req.body;
    data.user_id = req.user.id;

    const newAddress = await Address.create(data);
    return res.json(newAddress);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getAddressAll = async (req, res) => {
  const { id: user_id } = req.user;

  try {
    const addresses = await Address.findAll({
      where: { user_id },
      attributes: { exclude: ['createdAt', 'updatedAt', 'user_id'] },
    });

    return res.json(addresses);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getAddressOne = async (req, res) => {
  const { id } = req.params;
  const { id: user_id, isAdmin } = req.user;

  try {
    const address = await Address.findByPk(id);
    if (!address) return res.status(404).json({ msg: 'Dirección no encontrada' });
    if (address.user_id !== user_id && !isAdmin)
      return res.status(403).json({ msg: 'Dirección no válida' });

    return res.json(address);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updateAddress = async (req, res) => {
  const { id } = req.params;
  const { id: user_id } = req.user;

  try {
    const address = await Address.findByPk(id);

    if (!address) return res.status(404).json({ msg: 'Dirección no encontrada' });
    if (address.user_id !== user_id && !isAdmin)
      return res.status(403).json({ msg: 'Dirección no válida' });

    address.street = req.body.street;
    address.colony = req.body.colony;
    address.city = req.body.city;
    address.state = req.body.state;
    address.country = req.body.country;
    address.zip = req.body.zip;
    address.phone = req.body.phone;

    await address.save();

    return res.json({ msg: 'Dirección actualizada correctamente' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const deleteAddress = async (req, res) => {
  const { id } = req.params;
  const { id: user_id } = req.user;

  try {
    await Address.destroy({ where: { id } });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export { createAddress, getAddressAll, getAddressOne, updateAddress, deleteAddress };

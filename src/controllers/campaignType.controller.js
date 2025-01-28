import { CampaignType } from '../models/CampaignType.js';

const getCampaignTypeAll = async (req, res) => {
  const { isAdmin } = req.user;

  if (!isAdmin) return res.status(403).json({ msg: 'Acción no permitida' });

  try {
    const campaignTypes = await CampaignType.findAll();

    return res.json(campaignTypes);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const createCampaignType = async (req, res) => {
  const { isAdmin } = req.user;

  if (!isAdmin) return res.status(403).json({ msg: 'Acción no permitida' });

  try {
    const newCampaignType = await CampaignType.create(req.body);
    return res.json(newCampaignType);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updateCampaignType = async (req, res) => {
  const { isAdmin } = req.user;
  const { id } = req.params;
  const { name } = req.body;

  if (!isAdmin) return res.status(403).json({ msg: 'Acción no permitida' });

  try {
    const campaignType = await CampaignType.findOne({ where: { id } });

    if (!campaignType) return res.status(404).json({ msg: 'Tipo de campaña no encontrado' });

    campaignType.name = name || campaignType.name;
    await campaignType.save();

    return res.json({ msg: 'Tipo de campaña actualizado correctamente' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const deleteCampaignType = async (req, res) => {
  const { isAdmin } = req.user;
  const { id } = req.params;

  if (!isAdmin) return res.status(403).json({ msg: 'Acción no permitida' });

  try {
    await CampaignType.destroy({ where: { id } });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export { getCampaignTypeAll, createCampaignType, updateCampaignType, deleteCampaignType };

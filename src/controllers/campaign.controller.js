import { Campaign } from '../models/Campaign.js';

const getCampaignAll = async (req, res) => {
  try {
    const campaigns = await Campaign.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });
    return res.json(campaigns);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getCampaignById = async (req, res) => {
  const { isAdmin } = req.user;
  const { id } = req.params;

  if (!isAdmin) return res.status(403).json({ msg: 'Acción no permitida' });

  try {
    const campaign = await Campaign.findOne({
      where: { id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    if (!campaign) return res.status(404).json({ msg: 'Campaña no encontrada' });

    return res.json(campaign);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const createCampaign = async (req, res) => {
  const { isAdmin } = req.user;

  if (!isAdmin) return res.status(403).json({ msg: 'Acción no permitida' });

  try {
    const newCampaign = await Campaign.create(req.body);
    return res.json(newCampaign);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updateCampaign = async (req, res) => {
  const { isAdmin } = req.user;
  const { id } = req.params;

  if (!isAdmin) return res.status(403).json({ msg: 'Acción no permitida' });

  try {
    const campaign = await Campaign.findOne({
      where: { id },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    });

    if (!campaign) return res.status(404).json({ msg: 'Campaña no encontrada' });

    campaign.name = req.body.name || campaign.name;
    campaign.from = req.body.from || campaign.from;
    campaign.to = req.body.to || campaign.to;
    campaign.campaign_type_id = req.body.campaign_type_id || campaign.campaign_type_id;

    await campaign.save();
    return res.json({ msg: 'Campaña actualizada correctamente' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const deleteCampaign = async (req, res) => {
  const { isAdmin } = req.user;
  const { id } = req.params;

  if (!isAdmin) return res.status(403).json({ msg: 'Acción no permitida' });

  try {
    await Campaign.destroy({ where: { id } });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export { getCampaignAll, getCampaignById, createCampaign, updateCampaign, deleteCampaign };

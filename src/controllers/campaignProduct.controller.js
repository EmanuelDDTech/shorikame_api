import { Campaign } from '../models/Campaign.js';
import { CampaignProduct } from '../models/CampaignProduct.js';
import { Product } from '../models/Product.js';
import { ProductGallery } from '../models/ProductGallery.js';

const getByCampaignId = async (req, res) => {
  const { campaignId } = req.params;

  try {
    const campaignProducts = await CampaignProduct.findAll({
      where: { campaign_id: campaignId },
      attributes: { exclude: ['createdAt', 'updatedAt', 'product_id'] },
      include: {
        model: Product,
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
        include: {
          model: ProductGallery,
          attributes: ['url'],
          where: { order: 1 },
        },
      },
    });

    return res.json(campaignProducts);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const createCampaignProduct = async (req, res) => {
  const { isAdmin } = req.user;

  if (!isAdmin) return res.status(403).json({ msg: 'Acción no permitida' });

  try {
    const newCampaignProduct = await CampaignProduct.create(req.body);
    return res.json(newCampaignProduct);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const getCampaignProductAll = async (req, res) => {
  try {
    const campaignProducts = await Campaign.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      include: {
        model: CampaignProduct,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    });

    return res.json(campaignProducts);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const updateCampaignProduct = async (req, res) => {
  const { isAdmin } = req.user;
  const { id } = req.params;

  if (!isAdmin) return res.status(403).json({ msg: 'Acción no permitida' });

  try {
    const campaignProduct = await CampaignProduct.findOne({ where: { id } });

    if (!campaignProduct) return res.status(404).json({ msg: 'El registro no existe' });

    campaignProduct.campaign_price = req.body.campaign_price || campaignProduct.campaign_price;

    campaignProduct.save();

    return res.json({ msg: 'Campaña actualizada correctamente' });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const deleteCampaignProduct = async (req, res) => {
  const { isAdmin } = req.user;
  const { id } = req.params;

  if (!isAdmin) return res.status(403).json({ msg: 'Acción no permitida' });

  try {
    await CampaignProduct.destroy({ where: { id } });
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const deleteByCampaignId = async (req, res) => {
  const { isAdmin } = req.user;
  const { id } = req.params;

  if (!isAdmin) return res.status(403).json({ msg: 'Acción no permitida' });

  try {
    await CampaignProduct.destroy({ where: { campaign_id: id } });
    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

export {
  getCampaignProductAll,
  createCampaignProduct,
  getByCampaignId,
  updateCampaignProduct,
  deleteCampaignProduct,
  deleteByCampaignId,
};

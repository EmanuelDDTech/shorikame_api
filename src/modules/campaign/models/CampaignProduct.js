import { DataTypes } from 'sequelize';
import { sequelize } from '#src/database/database.js';
import { Campaign } from '#modules/campaign/models/Campaign.js';
import { Product } from '#modules/product/models/Product.js';

export const CampaignProduct = sequelize.define('campaign_product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  campaign_price: {
    type: DataTypes.DOUBLE,
  },
});

Campaign.hasMany(CampaignProduct, {
  foreignKey: 'campaign_id',
  sourceKey: 'id',
});
CampaignProduct.belongsTo(Campaign, {
  foreignKey: 'campaign_id',
  targetId: 'id',
});

Product.hasMany(CampaignProduct, {
  foreignKey: 'product_id',
  sourceKey: 'id',
});
CampaignProduct.belongsTo(Product, {
  foreignKey: 'product_id',
  targetId: 'id',
});

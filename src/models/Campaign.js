import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';
import { CampaignType } from './CampaignType.js';

export const Campaign = sequelize.define('campaign', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
  },
  from: {
    type: DataTypes.DATE,
  },
  to: {
    type: DataTypes.DATE,
  },
});

CampaignType.hasMany(Campaign, {
  foreignKey: 'campaign_type_id',
  sourceKey: 'id',
});
Campaign.belongsTo(CampaignType, {
  foreignKey: 'campaign_type_id',
  targetId: 'id',
});

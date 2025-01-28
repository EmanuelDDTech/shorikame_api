import { DataTypes } from 'sequelize';
import { sequelize } from '../database/database.js';

export const CampaignType = sequelize.define('campaign_type', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

import { DataTypes } from 'sequelize';
import { sequelize } from '../../../database/database.js';
import { DeliveryCarrier } from './DeliveryCarrier.js';

export const DeliveryPriceRule = sequelize.define('delivery_price_rule', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  carrier_id: {
    type: DataTypes.INTEGER,
  },
  max_value: {
    type: DataTypes.DOUBLE,
  },
  list_base_price: {
    type: DataTypes.DOUBLE,
  },
});

DeliveryCarrier.hasMany(DeliveryPriceRule, {
  foreignKey: 'carrier_id',
  sourceKey: 'id',
});
DeliveryPriceRule.belongsTo(DeliveryCarrier, {
  foreignKey: 'carrier_id',
  targetId: 'id',
});

import { sequelize } from '#src/database/database.js';
import { DataTypes } from 'sequelize';

export const ShippingCoverageRule = sequelize.define('shipping_coverage_rules', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  carrier_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'shipping_carriers',
      key: 'id',
    },
  },
  rule_type: {
    type: DataTypes.ENUM('INCLUDE', 'EXCLUDE'),
  },
  zip_group_id: {
    type: DataTypes.INTEGER,
  },
  zip_code_id: {
    type: DataTypes.INTEGER,
  },
});

const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class ProductTag extends Model {}

ProductTag.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'products',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  tagId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'tags',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
}, {
  sequelize,
  modelName: 'ProductTag',
  tableName: 'product_tags',
  timestamps: false,
});

module.exports = ProductTag;

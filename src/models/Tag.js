const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Tag extends Model {}

Tag.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  sequelize,
  modelName: 'Tag',
  tableName: 'tags',
  timestamps: true,
  underscored: true,
});

module.exports = Tag;

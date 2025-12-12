const { sequelize } = require('../config/database');
const Category = require('./Category');
const Product = require('./Product');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');
const User = require('./User');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Define associations
const defineAssociations = require('./associations');
defineAssociations();

module.exports = {
  sequelize,
  Category,
  Product,
  Tag,
  ProductTag,
  User,
  Order,
  OrderItem,
};

const Category = require('./Category');
const Product = require('./Product');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');
const User = require('./User');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

const defineAssociations = () => {
  // Relación Category-Product (Uno a Muchos)
  Category.hasMany(Product, { foreignKey: 'categoryId' });
  Product.belongsTo(Category, { foreignKey: 'categoryId' });

  // Relación Product-Tag (Muchos a Muchos)
  Product.belongsToMany(Tag, { through: ProductTag, foreignKey: 'productId' });
  Tag.belongsToMany(Product, { through: ProductTag, foreignKey: 'tagId' });

  // Relación User-Order (Uno a Muchos)
  User.hasMany(Order, { foreignKey: 'userId' });
  Order.belongsTo(User, { foreignKey: 'userId' });

  // Relación Order-OrderItem (Uno a Muchos)
  Order.hasMany(OrderItem, { foreignKey: 'orderId' });
  OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

  // Relación Product-OrderItem (Uno a Muchos)
  Product.hasMany(OrderItem, { foreignKey: 'productId' });
  OrderItem.belongsTo(Product, { foreignKey: 'productId' });
};

module.exports = defineAssociations;

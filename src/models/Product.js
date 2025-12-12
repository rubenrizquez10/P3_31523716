const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

// Helper function to generate a slug
const generateSlug = (name) => {
  return name
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
};

class Product extends Model {}

Product.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  publisher: { // Editorial (e.g., Marvel, DC, Image)
    type: DataTypes.STRING,
    allowNull: false,
  },
  sku: { // Stock Keeping Unit
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  // Atributos personalizados adicionales para "Cómics"
  series: { // Nombre de la serie (e.g., The Amazing Spider-Man, Batman)
    type: DataTypes.STRING,
    allowNull: true,
  },
  issue_number: { // Número del cómic
    type: DataTypes.STRING,
    allowNull: true,
  },
  publication_date: { // Fecha de publicación
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Product',
  tableName: 'products',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeValidate: (product, options) => {
      if (product.name) {
        product.slug = generateSlug(product.name);
      }
    },
    beforeUpdate: async (product, options) => {
        // Find a unique slug
        if (product.changed('name')) {
            let slug = generateSlug(product.name);
            let count = 0;
            let uniqueSlug = slug;
            while (await Product.findOne({ where: { slug: uniqueSlug } })) {
                count++;
                uniqueSlug = `${slug}-${count}`;
            }
            product.slug = uniqueSlug;
        }
    },
    beforeCreate: async (product, options) => {
        // Find a unique slug
        let slug = generateSlug(product.name);
        let count = 0;
        let uniqueSlug = slug;
        while (await Product.findOne({ where: { slug: uniqueSlug } })) {
            count++;
            uniqueSlug = `${slug}-${count}`;
        }
        product.slug = uniqueSlug;
    }
  },
});

module.exports = Product;

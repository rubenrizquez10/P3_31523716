const Product = require('../models/Product');
const Category = require('../models/Category');
const Tag = require('../models/Tag');

class ProductRepository {
  async findById(id) {
    return await Product.findByPk(id, {
      include: [Category, Tag],
    });
  }

  async findAll(queryOptions) {
    return await Product.findAndCountAll(queryOptions);
  }

  async create(productData, categoryId, tagIds) {
    const product = await Product.create({ ...productData, categoryId });
    if (tagIds && tagIds.length > 0) {
      await product.setTags(tagIds);
    }
    // Reload product with associations
    return await this.findById(product.id);
  }

  async update(id, productData, categoryId, tagIds) {
    const product = await this.findById(id);
    if (!product) {
      return null;
    }
    await product.update({ ...productData, categoryId });
    // Ensure tagIds is an array, even if empty, to correctly set/clear tags
    await product.setTags(tagIds || []);
    // Reload product with associations
    return await this.findById(id);
  }

  async delete(id) {
    const product = await this.findById(id);
    if (!product) {
      return false;
    }
    await product.destroy();
    return true;
  }
}

module.exports = new ProductRepository();

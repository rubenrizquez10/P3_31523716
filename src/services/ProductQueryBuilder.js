const { Op } = require('sequelize');
const Category = require('../models/Category');
const Tag = require('../models/Tag');

class ProductQueryBuilder {
  constructor() {
    this.queryOptions = {
      where: {},
      include: [{ model: Category, as: 'Category' }],
    };
  }

  paginate(page = 1, limit = 10) {
    this.queryOptions.offset = (page - 1) * limit;
    this.queryOptions.limit = parseInt(limit);
    return this;
  }

  filterByCategory(categoryId) {
    if (categoryId) {
      this.queryOptions.where.categoryId = categoryId;
    }
    return this;
  }

  filterByTags(tags) {
    if (tags) {
      this.queryOptions.include.push({
        model: Tag,
        where: { id: { [Op.in]: tags.split(',') } },
        through: { attributes: [] } // Exclude ProductTag join table attributes
      });
    }
    // If no tags are provided, we don't add a Tag include unless it's for other purposes.
    // The default include for Category is already in the constructor.
    return this;
  }

  filterByPriceRange(price_min, price_max) {
    if (price_min) {
      this.queryOptions.where.price = { ...this.queryOptions.where.price, [Op.gte]: price_min };
    }
    if (price_max) {
      this.queryOptions.where.price = { ...this.queryOptions.where.price, [Op.lte]: price_max };
    }
    return this;
  }

  search(term) {
    if (term) {
      this.queryOptions.where[Op.or] = [
        { name: { [Op.like]: `%${term}%` } },
        { description: { [Op.like]: `%${term}%` } },
      ];
    }
    return this;
  }

  filterByPublisher(publisher) {
    if (publisher) {
      this.queryOptions.where.publisher = publisher;
    }
    return this;
  }

  filterBySeries(series) {
    if (series) {
      this.queryOptions.where.series = series;
    }
    return this;
  }

  build() {
    return this.queryOptions;
  }
}

module.exports = ProductQueryBuilder;

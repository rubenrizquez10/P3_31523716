const ProductRepository = require('../repositories/ProductRepository');
const ProductQueryBuilder = require('../services/ProductQueryBuilder');

// @desc    Create a product
// @route   POST /products
// @access  Private
exports.createProduct = async (req, res) => {
  try {
    const { categoryId, tagIds, ...productData } = req.body;
    const product = await ProductRepository.create(productData, categoryId, tagIds);
    res.status(201).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// @desc    Get a single product for admin view
// @route   GET /products/:id
// @access  Private
exports.getAdminProduct = async (req, res) => {
  try {
    const product = await ProductRepository.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};

// @desc    Update a product
// @route   PUT /products/:id
// @access  Private
exports.updateProduct = async (req, res) => {
  try {
    const { categoryId, tagIds, ...productData } = req.body;
    const product = await ProductRepository.update(req.params.id, productData, categoryId, tagIds);
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// @desc    Delete a product
// @route   DELETE /products/:id
// @access  Private
exports.deleteProduct = async (req, res) => {
  try {
    const success = await ProductRepository.delete(req.params.id);
    if (!success) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      });
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};

// @desc    Get public product with self-healing URL
// @route   GET /p/:idSlug (format: id-slug)
// @access  Public
exports.getPublicProduct = async (req, res) => {
  try {
    const { idSlug } = req.params;
    // Parse id-slug format: extract id (number before first dash) and slug (rest)
    const dashIndex = idSlug.indexOf('-');
    if (dashIndex === -1) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid URL format',
      });
    }
    const id = idSlug.substring(0, dashIndex);
    const slug = idSlug.substring(dashIndex + 1);
    const productIdNum = parseInt(id, 10); // Ensure ID is a number
    const product = await ProductRepository.findById(productIdNum);
    if (!product) {
      return res.status(404).json({
        status: 'fail',
        message: 'Product not found',
      });
    }
    if (product.slug !== slug) {
      const correctUrl = `/p/${product.id}-${product.slug}`;
      return res.redirect(301, correctUrl);
    }
    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};

// @desc    Get public products with advanced filtering
// @route   GET /products
// @access  Public
exports.getPublicProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, tags, price_min, price_max, search, publisher, series } = req.query;

    const queryBuilder = new ProductQueryBuilder();
    const queryOptions = queryBuilder
      .paginate(page, limit)
      .filterByCategory(category)
      .filterByTags(tags)
      .filterByPriceRange(price_min, price_max)
      .search(search)
      .filterByPublisher(publisher)
      .filterBySeries(series)
      .build();

    const { count, rows } = await ProductRepository.findAll(queryOptions);

    res.status(200).json({
      status: 'success',
      data: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        products: rows,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};

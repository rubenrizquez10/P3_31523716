const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /categories
// @access  Private
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json({
      status: 'success',
      data: {
        categories,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};

// @desc    Get single category
// @route   GET /categories/:id
// @access  Private
exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        category,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};

// @desc    Create a category
// @route   POST /categories
// @access  Private
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newCategory = await Category.create({ name, description });
    res.status(201).json({
      status: 'success',
      data: {
        category: newCategory,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// @desc    Update a category
// @route   PUT /categories/:id
// @access  Private
exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found',
      });
    }
    await category.update({ name, description });
    res.status(200).json({
      status: 'success',
      data: {
        category,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// @desc    Delete a category
// @route   DELETE /categories/:id
// @access  Private
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) {
      return res.status(404).json({
        status: 'fail',
        message: 'Category not found',
      });
    }
    await category.destroy();
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

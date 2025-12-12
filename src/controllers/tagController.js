const Tag = require('../models/Tag');

// @desc    Get all tags
// @route   GET /tags
// @access  Private
exports.getTags = async (req, res) => {
  try {
    const tags = await Tag.findAll();
    res.status(200).json({
      status: 'success',
      data: {
        tags,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};

// @desc    Get single tag
// @route   GET /tags/:id
// @access  Private
exports.getTag = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tag not found',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        tag,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error',
    });
  }
};

// @desc    Create a tag
// @route   POST /tags
// @access  Private
exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;
    const newTag = await Tag.create({ name });
    res.status(201).json({
      status: 'success',
      data: {
        tag: newTag,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// @desc    Update a tag
// @route   PUT /tags/:id
// @access  Private
exports.updateTag = async (req, res) => {
  try {
    const { name } = req.body;
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tag not found',
      });
    }
    await tag.update({ name });
    res.status(200).json({
      status: 'success',
      data: {
        tag,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
};

// @desc    Delete a tag
// @route   DELETE /tags/:id
// @access  Private
exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      return res.status(404).json({
        status: 'fail',
        message: 'Tag not found',
      });
    }
    await tag.destroy();
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

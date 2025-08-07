const Article = require('../models/Article');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middlewares/async');
const { uploadToCloudinary } = require('../utils/upload');

// @desc    Get all articles
// @route   GET /api/v1/articles
// @access  Public
exports.getArticles = asyncHandler(async (req, res, next) => {
  // Advanced filtering
  let query;
  const reqQuery = { ...req.query };
  
  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach(param => delete reqQuery[param]);
  
  // Create query string
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
  
  // Finding resource
  query = Article.find(JSON.parse(queryStr)).populate('author', 'name avatar');
  
  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }
  
  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }
  
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Article.countDocuments();
  
  query = query.skip(startIndex).limit(limit);
  
  // Executing query
  const articles = await query;
  
  // Pagination result
  const pagination = {};
  
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }
  
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }
  
  res.status(200).json({
    success: true,
    count: articles.length,
    pagination,
    data: articles
  });
});

// @desc    Get single article
// @route   GET /api/v1/articles/:id
// @access  Public
exports.getArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findById(req.params.id).populate('author', 'name avatar');
  
  if (!article) {
    return next(
      new ErrorResponse(`Article not found with id of ${req.params.id}`, 404)
    );
  }
  
  res.status(200).json({
    success: true,
    data: article
  });
});

// @desc    Create new article
// @route   POST /api/v1/articles
// @access  Private
exports.createArticle = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.author = req.user.id;
  req.body.authorName = req.user.name;
  
  // Handle image upload
  if (req.files && req.files.image) {
    const result = await uploadToCloudinary(req.files.image.tempFilePath);
    req.body.image = result.secure_url;
  }
  
  const article = await Article.create(req.body);
  
  res.status(201).json({
    success: true,
    data: article
  });
});

// @desc    Update article
// @route   PUT /api/v1/articles/:id
// @access  Private
exports.updateArticle = asyncHandler(async (req, res, next) => {
  let article = await Article.findById(req.params.id);
  
  if (!article) {
    return next(
      new ErrorResponse(`Article not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Make sure user is article owner or admin
  if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this article`,
        401
      )
    );
  }
  
  // Handle image upload if new image is provided
  if (req.files && req.files.image) {
    const result = await uploadToCloudinary(req.files.image.tempFilePath);
    req.body.image = result.secure_url;
  }
  
  article = await Article.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    success: true,
    data: article
  });
});

// @desc    Delete article
// @route   DELETE /api/v1/articles/:id
// @access  Private
exports.deleteArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findById(req.params.id);
  
  if (!article) {
    return next(
      new ErrorResponse(`Article not found with id of ${req.params.id}`, 404)
    );
  }
  
  // Make sure user is article owner or admin
  if (article.author.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this article`,
        401
      )
    );
  }
  
  await article.remove();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get articles by category
// @route   GET /api/v1/articles/category/:category
// @access  Public
exports.getArticlesByCategory = asyncHandler(async (req, res, next) => {
  const articles = await Article.find({ category: req.params.category })
    .populate('author', 'name avatar')
    .sort('-createdAt');
  
  res.status(200).json({
    success: true,
    count: articles.length,
    data: articles
  });
});

// @desc    Search articles
// @route   GET /api/v1/articles/search/:query
// @access  Public
exports.searchArticles = asyncHandler(async (req, res, next) => {
  const articles = await Article.find({
    $or: [
      { title: { $regex: req.params.query, $options: 'i' } },
      { excerpt: { $regex: req.params.query, $options: 'i' } },
      { content: { $regex: req.params.query, $options: 'i' } }
    ]
  })
    .populate('author', 'name avatar')
    .sort('-createdAt');
  
  res.status(200).json({
    success: true,
    count: articles.length,
    data: articles
  });
});
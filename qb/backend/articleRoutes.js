const express = require('express');
const {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  getArticlesByCategory,
  searchArticles
} = require('../controllers/articleController');
const { protect, authorize } = require('../middlewares/auth');
const upload = require('../utils/upload');

const router = express.Router();

router
  .route('/')
  .get(getArticles)
  .post(protect, authorize('publisher', 'admin'), upload.single('image'), createArticle);

router
  .route('/:id')
  .get(getArticle)
  .put(protect, authorize('publisher', 'admin'), updateArticle)
  .delete(protect, authorize('publisher', 'admin'), deleteArticle);

router.route('/category/:category').get(getArticlesByCategory);
router.route('/search/:query').get(searchArticles);

module.exports = router;
// =============================================================
// Post Category Routes
// =============================================================
// Mounts CRUD endpoints for custom post categories.
// All routes require JWT authentication (applied externally).
//
// Base path: /api/v1/post-categories
// =============================================================

const express = require('express');
const router = express.Router();
const {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/postCategoryController');

router.get('/', getAllCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;

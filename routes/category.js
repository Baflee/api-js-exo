const express = require('express');
const auth = require('../middleware/auth');
const categoryCtr = require('../controllers/category');

const router = express.Router();

//Route to create an category
router.post('/', categoryCtr.createCategory);

// Route to fetch categories
router.get('/', categoryCtr.getCategories);

// Route to delete one category
router.delete('/', categoryCtr.deleteCategory);


module.exports = router;
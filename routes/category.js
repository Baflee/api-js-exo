const express = require('express');
const auth = require('../middleware/auth');
const categoryCtr = require('../controllers/category');

const router = express.Router();

router.post('/', auth.isUserAdmin, categoryCtr.createCategory);

router.get('/', categoryCtr.getCategories);

router.delete('/', auth.isUserAdmin, categoryCtr.deleteCategory);


module.exports = router;
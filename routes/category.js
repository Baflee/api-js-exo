const express = require('express');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const categoryCtr = require('../controllers/category');

const router = express.Router();

router.post('/', authAdmin, categoryCtr.createCategory);

router.get('/', auth, categoryCtr.getCategories);

router.delete('/', authAdmin, categoryCtr.deleteCategory);


module.exports = router;
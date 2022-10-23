const express = require('express'); 
const auth = require('../middleware/auth');
const bookCtr = require('../controllers/book');

const router = express.Router();

router.post('/', auth.isUserAdmin, bookCtr.addBook);

router.patch('/', auth.isUserAdmin, bookCtr.modifyBook);

router.delete('/', auth.isUserAdmin, bookCtr.deleteBook);

router.get('/', bookCtr.getBooks);

router.get('/:id', bookCtr.getBook);

router.get('/category/:name', bookCtr.getBookWithCategory);


module.exports = router;
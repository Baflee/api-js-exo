const express = require('express'); 
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const bookCtr = require('../controllers/book');

const router = express.Router();

router.post('/', authAdmin, bookCtr.addBook);

router.patch('/', authAdmin, bookCtr.modifyBook);

router.delete('/', authAdmin, bookCtr.deleteBook);

router.get('/', auth, bookCtr.getBooks);

router.get('/:id', auth, bookCtr.getBook);

router.get('/getBookWithcategory', auth, bookCtr.getBookWithCategory);


module.exports = router;
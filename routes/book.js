const express = require('express'); 
const auth = require('../middleware/auth');
const bookCtr = require('../controllers/book');

// Import the book methods

const router = express.Router();

// Create a book
router.post('/', auth, bookCtr.addBook);

// Modify a book
router.patch('/', auth, bookCtr.modifyBook);

// Delete a book
router.delete('/', auth, bookCtr.deleteBook);

// Fetch all Books
router.get('/', auth, bookCtr.getBooks);

// Fetch one book based on name
router.get('/getBook', auth, bookCtr.getBook);

// Fetch one book based on category
router.get('/getBookWithcategory', bookCtr.getBookWithCategory);


module.exports = router;
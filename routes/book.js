const express = require('express'); 
const auth = require('../middleware/auth');
const bookCtr = require('../controllers/book');

// Import the book methods

const router = express.Router();

// Create a book
router.post('/', bookCtr.addBook);

// Modify a book
router.patch('/', bookCtr.modifyBook);

// Delete a book
router.delete('/', bookCtr.deleteBook);

// Fetch all Books
router.get('/', bookCtr.getBooks);

// Fetch one book based on name
router.get('/getBook', bookCtr.getBook);

// Fetch one book based on category
//router.post('/', bookCtr.getBookCategory);


module.exports = router;
const express = require('express');
const router = express.Router();

const { addBook, getBooks, getBookById,searchBooks } = require('../controllers/bookController');
const { auth } = require('../middleware/auth');

router.post('/books', auth, addBook);
router.get('/books', getBooks);
router.get('/books/:id', getBookById);
router.get('/search', searchBooks);

module.exports = router;

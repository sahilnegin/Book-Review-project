const Book = require('../models/Book');
const Review = require('../models/Review'); 

exports.addBook = async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    const book = new Book({
      title,
      author,
      genre,
      createdBy: req.user.id
    });
    await book.save();
    res.status(201).json({ msg: 'Book added', book });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, author, genre } = req.query;
    const query = {};
    if (author) query.author = new RegExp(author, 'i');
    if (genre) query.genre = new RegExp(genre, 'i');

    const books = await Book.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(books);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).lean();
    if (!book) return res.status(404).json({ msg: 'Book not found' });

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const reviews = await Review.find({ book: book._id })
      .populate('user', 'username') 
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Calculate average rating
    const ratings = await Review.aggregate([
      { $match: { book: book._id } },
      { $group: { _id: '$book', avgRating: { $avg: '$rating' } } },
    ]);

    book.reviews = reviews;
    book.averageRating = ratings[0] ? ratings[0].avgRating.toFixed(2) : 'No ratings yet';

    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};
exports.searchBooks = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ msg: 'Search query is required' });

    const regex = new RegExp(q, 'i'); 
    const books = await Book.find({
      $or: [{ title: regex }, { author: regex }],
    });

    res.json(books);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

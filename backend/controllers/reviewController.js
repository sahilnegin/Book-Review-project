const Review = require('../models/Review');
const Book = require('../models/Book');

exports.addReview = async (req, res) => {
  try {
    console.log('auth user:', req.user);

    const { rating, comment } = req.body;
    const bookId = req.params.id;
    const userId = req.user.id;


    if (!rating || !comment) {
      console.log('Validation failed: Missing rating or comment');
      return res.status(400).json({ msg: 'Rating and comment are required' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      console.log('Book not found:', bookId);
      return res.status(404).json({ msg: 'Book not found' });
    }

    
    const existingReview = await Review.findOne({ book: bookId, user: userId });
    if (existingReview) {
      console.log('Review already exists for this user and book');
      return res.status(400).json({ msg: 'You already reviewed this book' });
    }

    
    const review = new Review({
      book: bookId,
      user: userId,
      rating,
      comment,
    });

    await review.save();
    console.log('Review saved:', review);

    res.status(201).json({ msg: 'Review added', review });
  } catch (err) {
    console.error('Error adding review:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ msg: 'Review not found' });

    if (review.user.toString() !== userId) {
      return res.status(403).json({ msg: 'Unauthorized to update this review' });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    review.updatedAt = Date.now();

    await review.save();

    res.json({ msg: 'Review updated', review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const userId = req.user.id;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ msg: 'Review not found' });

    if (review.user.toString() !== userId) {
      return res.status(403).json({ msg: 'Unauthorized to delete this review' });
    }

    await review.deleteOne();

    res.json({ msg: 'Review deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

import { Review, Book, User } from '../models/index.js';

// @desc    Add a review
// @route   POST /api/reviews
// @access  Private
export const addReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;

    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      where: { bookId, userId }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    const review = await Review.create({
      bookId,
      userId,
      userName,
      rating,
      comment
    });

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error adding review' });
  }
};

// @desc    Get reviews for a book
// @route   GET /api/reviews/:bookId
// @access  Public
export const getBookReviews = async (req, res) => {
  try {
    const { bookId } = req.params;
    
    const reviews = await Review.findAll({
      where: { bookId },
      order: [['createdAt', 'DESC']]
    });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
};

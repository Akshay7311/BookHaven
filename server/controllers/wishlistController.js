import { Wishlist, Book } from '../models/index.js';

export const getUserWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findAll({
      where: { userId: req.user.id },
      include: [{ model: Book, as: 'Book' }] // Return Book Details
    });
    
    // Map to array of books for easy frontend rendering
    const books = wishlist.map(item => item.Book).filter(b => b && !b.isDeleted);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

export const toggleWishlistItem = async (req, res) => {
  try {
    const { bookId } = req.body;
    
    // Check if it already exists
    const existing = await Wishlist.findOne({
      where: { userId: req.user.id, bookId }
    });

    if (existing) {
      // Remove it
      await existing.destroy();
      return res.json({ message: 'Removed from wishlist', action: 'removed' });
    } else {
      // Add it
      await Wishlist.create({ userId: req.user.id, bookId });
      return res.status(201).json({ message: 'Added to wishlist', action: 'added' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

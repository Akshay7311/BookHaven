import { CartItem, Book } from '../models/index.js';

// @desc    Get user cart items
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    const items = await CartItem.findAll({
      where: { userId: req.user.id },
      include: [{ model: Book, attributes: ['id', 'title', 'price', 'coverImageUrl', 'author', 'stock'] }]
    });
    
    // Map response structure to align with frontend expectations
    const formatted = items.map(item => ({
        id: item.id,
        book_id: item.Book.id,
        quantity: item.quantity,
        title: item.Book.title,
        price: item.Book.price,
        image_url: item.Book.coverImageUrl,
        author: item.Book.author,
        stock: item.Book.stock
    }));
    
    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;

    const book = await Book.findByPk(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    if (book.stock < quantity) return res.status(400).json({ message: 'Not enough stock available' });

    let cartItem = await CartItem.findOne({
      where: { userId: req.user.id, bookId }
    });

    if (cartItem) {
      cartItem.quantity += Number(quantity);
      await cartItem.save();
    } else {
      await CartItem.create({
        userId: req.user.id,
        bookId,
        quantity: Number(quantity)
      });
    }

    res.status(201).json({ message: 'Item added to cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    
    const cartItem = await CartItem.findOne({
        where: { id: req.params.id, userId: req.user.id },
        include: [Book]
    });

    if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });
    if (cartItem.Book.stock < quantity) return res.status(400).json({ message: 'Not enough stock available' });

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json({ message: 'Cart updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const cartItem = await CartItem.findOne({
        where: { id: req.params.id, userId: req.user.id }
    });

    if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });

    await cartItem.destroy();
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

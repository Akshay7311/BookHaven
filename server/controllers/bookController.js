import { Book, Category } from '../models/index.js';
import { Op } from 'sequelize';

// @desc    Get all books (with search, filter by category, and pagination)
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res) => {
  try {
    const { keyword = '', category = '', page = 1, limit = 12 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const whereClause = { isDeleted: false };

    if (keyword) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { author: { [Op.like]: `%${keyword}%` } }
      ];
    }

    if (category) {
      whereClause.categoryId = category; // Expect frontend to pass Category UUID or modify filter logic later
    }

    const { count, rows } = await Book.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset: Number(offset),
      order: [['createdAt', 'ASC']],
      include: [{ model: Category, as: 'category' }]
    });

    // Map output for frontend backwards compitability
    const mappedBooks = rows.map(b => ({
      id: b.id,
      title: b.title,
      author: b.author,
      description: b.description,
      price: b.price,
      image_url: b.coverImageUrl,
      category: b.category ? b.category.name : 'Uncategorized', // Output name string for frontend
      categoryId: b.categoryId,
      stock: b.stock
    }));

    res.json({
      books: mappedBooks,
      page: Number(page),
      pages: Math.ceil(count / Number(limit)),
      total: count
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
export const getBookById = async (req, res) => {
  try {
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    if (!uuidRegex.test(req.params.id)) {
        return res.status(404).json({ message: 'Book not found or invalid URL' });
    }

    const book = await Book.findByPk(req.params.id, {
        include: [{ model: Category, as: 'category' }]
    });

    if (!book || book.isDeleted) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const mappedBook = {
      id: book.id,
      title: book.title,
      author: book.author,
      description: book.description,
      price: book.price,
      image_url: book.coverImageUrl,
      category: book.category ? book.category.name : 'Uncategorized',
      categoryId: book.categoryId,
      stock: book.stock
    };

    res.json(mappedBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Admin
export const createBook = async (req, res) => {
  try {
    const { title, author, description, price, categoryId, stock } = req.body;
    
    let coverImageUrl = '';
    // If multer processed an image
    if (req.file) {
        coverImageUrl = req.file.path; // Cloudinary URL
    } else if (req.body.image_url) {
        coverImageUrl = req.body.image_url;
    }

    const book = await Book.create({
      title,
      author,
      description,
      price,
      coverImageUrl,
      categoryId: categoryId || null,
      stock: stock || 0
    });

    res.status(201).json({ message: 'Book created successfully', bookId: book.id, imageUrl: coverImageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private/Admin
export const updateBook = async (req, res) => {
  try {
    const { title, author, description, price, categoryId, stock } = req.body;
    
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    let coverImageUrl = book.coverImageUrl;
    if (req.file) {
      coverImageUrl = req.file.path; // New upload
    } else if (req.body.image_url !== undefined) {
      coverImageUrl = req.body.image_url; // Direct link update
    }

    await book.update({
      title,
      author,
      description,
      price,
      coverImageUrl,
      categoryId: categoryId !== undefined ? categoryId : book.categoryId,
      stock
    });

    res.json({ message: 'Book updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a book (Soft Delete to protect existing Orders)
// @route   DELETE /api/books/:id
// @access  Private/Admin
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Implementing a soft delete so historical order mapping isn't broken
    book.isDeleted = true;
    await book.save();

    res.json({ message: 'Book physically removed from catalog successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

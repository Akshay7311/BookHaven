import { Book, Category, BookImage, Review } from '../models/index.js';
import { Op } from 'sequelize';
import path from 'path';
import fs from 'fs';

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
      // Check if it's a UUID or a name
      const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
      if (uuidRegex.test(category)) {
        whereClause.categoryId = category;
      } else {
        // Find category by name (case-insensitive)
        const cat = await Category.findOne({
          where: { name: { [Op.like]: category } }
        });
        if (cat) {
          whereClause.categoryId = cat.id;
        } else {
          // If category not found by name, force no results by using a non-existent UUID or null if appropriate
          // For safety, we'll just use a dummy UUID that won't match anything
          whereClause.categoryId = '00000000-0000-0000-0000-000000000000';
        }
      }
    }

    const { count, rows } = await Book.findAndCountAll({
      where: whereClause,
      limit: Number(limit),
      offset: Number(offset),
      order: [['createdAt', 'ASC']],
      include: [
        { model: Category, as: 'category' },
        { model: BookImage, as: 'images' }
      ]
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
      stock: b.stock,
      images: b.images ? b.images.map(img => ({
          id: img.id,
          imageUrl: img.imageUrl,
          isPrimary: img.isPrimary
      })) : []
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
        include: [
            { model: Category, as: 'category' },
            { model: BookImage, as: 'images' },
            { model: Review, as: 'reviews' }
        ]
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
      stock: book.stock,
      images: book.images ? book.images.map(img => ({
          id: img.id,
          imageUrl: img.imageUrl,
          isPrimary: img.isPrimary
      })) : [],
      reviews: book.reviews || [],
      rating: book.reviews && book.reviews.length > 0 
        ? (book.reviews.reduce((acc, rev) => acc + rev.rating, 0) / book.reviews.length).toFixed(1)
        : 4.0, // Keeping 4.0 as default if no reviews for aesthetic but based on data if exists
      numReviews: book.reviews ? book.reviews.length : 0
    };

    res.json(mappedBook);
  } catch (error) {
    console.error('Error in getBookById:', error);
    res.status(500).json({ 
        message: 'Server Error', 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
};

// @desc    Create a book
// @route   POST /api/books
// @access  Private/Admin
export const createBook = async (req, res) => {
  try {
    const { title, author, description, price, categoryId, stock } = req.body;
    
    const categoryRecord = await Category.findByPk(categoryId);
    const catFolder = categoryRecord ? categoryRecord.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'uncategorized';
    const catPath = path.join(path.resolve(), '../client/public/covers', catFolder);
    
    if (!fs.existsSync(catPath)) {
        fs.mkdirSync(catPath, { recursive: true });
    }

    let coverImageUrl = '/covers/default.jpg';
    
    // 1. Process Cover Image
    if (req.files && req.files['coverImage'] && req.files['coverImage'][0]) {
        const file = req.files['coverImage'][0];
        if (!file.path.startsWith('http')) {
            const filename = path.basename(file.path);
            const newPath = path.join(catPath, filename);
            if (fs.existsSync(file.path)) fs.renameSync(file.path, newPath);
            coverImageUrl = `/covers/${catFolder}/${filename}`;
        } else {
            coverImageUrl = file.path;
        }
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

    // 2. Process Gallery Images
    if (req.files && req.files['images'] && req.files['images'].length > 0) {
        const imageRecords = [];
        
        // Add the primary cover to the gallery as well (optional, but keep it for consistency)
        imageRecords.push({
            bookId: book.id,
            imageUrl: coverImageUrl,
            isPrimary: true
        });

        for (const file of req.files['images']) {
            if (!file.path.startsWith('http')) {
                const filename = path.basename(file.path);
                const newPath = path.join(catPath, filename);
                if (fs.existsSync(file.path)) fs.renameSync(file.path, newPath);
                
                imageRecords.push({
                    bookId: book.id,
                    imageUrl: `/covers/${catFolder}/${filename}`,
                    isPrimary: false
                });
            } else {
                imageRecords.push({
                    bookId: book.id,
                    imageUrl: file.path,
                    isPrimary: false
                });
            }
        }
        await BookImage.bulkCreate(imageRecords);
    } else {
        // If no gallery images, still record the cover as primary in gallery
        await BookImage.create({
            bookId: book.id,
            imageUrl: coverImageUrl,
            isPrimary: true
        });
    }

    res.status(201).json({ 
        message: 'Book created successfully', 
        bookId: book.id, 
        imageUrl: book.coverImageUrl,
        imagesCount: req.files ? req.files.length : 0
    });
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

    const getUrl = (file) => {
        if (!file) return '';
        if (file.path.startsWith('http')) return file.path;
        return `/covers/${path.basename(file.path)}`;
    };

    const categoryChanged = categoryId !== undefined && categoryId !== book.categoryId;
    const finalCategoryId = categoryId !== undefined ? categoryId : book.categoryId;
    
    // Determine category folder
    const categoryRecord = await Category.findByPk(finalCategoryId);
    const catFolder = categoryRecord ? categoryRecord.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'uncategorized';
    const catPath = path.join(path.resolve(), '../client/public/covers', catFolder);
    
    if (!fs.existsSync(catPath)) {
        fs.mkdirSync(catPath, { recursive: true });
    }

    let coverImageUrl = book.coverImageUrl;

    // 1. Handle Cover Image Update
    if (req.files && req.files['coverImage'] && req.files['coverImage'][0]) {
        const file = req.files['coverImage'][0];
        if (!file.path.startsWith('http')) {
            const filename = path.basename(file.path);
            const newPath = path.join(catPath, filename);
            if (fs.existsSync(file.path)) fs.renameSync(file.path, newPath);
            coverImageUrl = `/covers/${catFolder}/${filename}`;
        } else {
            coverImageUrl = file.path;
        }
        
        // Update primary image in gallery
        await BookImage.update({ isPrimary: false }, { where: { bookId: book.id } });
        await BookImage.create({
            bookId: book.id,
            imageUrl: coverImageUrl,
            isPrimary: true
        });
    } else if (categoryChanged && book.coverImageUrl && book.coverImageUrl.startsWith('/covers/')) {
        // Just move existing cover if category changed
        const parts = book.coverImageUrl.split('/');
        const filename = parts[parts.length - 1];
        const oldRelativePath = book.coverImageUrl;
        const oldAbsolutePath = path.join(path.resolve(), '../client/public', oldRelativePath);
        const newRelativePath = `/covers/${catFolder}/${filename}`;
        const newAbsolutePath = path.join(catPath, filename);

        if (fs.existsSync(oldAbsolutePath) && oldAbsolutePath !== newAbsolutePath) {
            fs.renameSync(oldAbsolutePath, newAbsolutePath);
            coverImageUrl = newRelativePath;
            
            // Also update the gallery record for this image
            await BookImage.update({ imageUrl: newRelativePath }, { where: { imageUrl: oldRelativePath, bookId: book.id } });
        }
    }

    // 2. Handle New Gallery Images
    if (req.files && req.files['images'] && req.files['images'].length > 0) {
        const imageRecords = [];
        for (const file of req.files['images']) {
            if (!file.path.startsWith('http')) {
                const filename = path.basename(file.path);
                const newPath = path.join(catPath, filename);
                if (fs.existsSync(file.path)) fs.renameSync(file.path, newPath);
                
                imageRecords.push({
                    bookId: book.id,
                    imageUrl: `/covers/${catFolder}/${filename}`,
                    isPrimary: false
                });
            } else {
                imageRecords.push({
                    bookId: book.id,
                    imageUrl: file.path,
                    isPrimary: false
                });
            }
        }
        await BookImage.bulkCreate(imageRecords);
    } else if (req.body.image_url !== undefined) {
        coverImageUrl = req.body.image_url;
    }

    await book.update({
      title,
      author,
      description,
      price,
      coverImageUrl,
      categoryId: finalCategoryId,
      stock
    });

    res.json({ message: 'Book updated successfully', coverImageUrl });
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

    res.json({ message: 'Book marked as deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

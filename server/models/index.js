import sequelize from '../config/db.js';
import User from './User.js';
import Book from './Book.js';
import BookImage from './BookImage.js';
import CartItem from './CartItem.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import Category from './Category.js';
import Coupon from './Coupon.js';
import Banner from './Banner.js';
import ContactMessage from './ContactMessage.js';
import Wishlist from './Wishlist.js';
import AuditLog from './AuditLog.js';

// Relations

// A Book has many BookImages
Book.hasMany(BookImage, { foreignKey: 'bookId', as: 'images' });
BookImage.belongsTo(Book, { foreignKey: 'bookId' });

// Category <-> Book
Category.hasMany(Book, { foreignKey: 'categoryId', as: 'books', onDelete: 'SET NULL' });
Book.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// User <-> Wishlist
User.hasMany(Wishlist, { foreignKey: 'userId', onDelete: 'CASCADE' });
Wishlist.belongsTo(User, { foreignKey: 'userId' });

// Book <-> Wishlist
Book.hasMany(Wishlist, { foreignKey: 'bookId', onDelete: 'CASCADE' });
Wishlist.belongsTo(Book, { foreignKey: 'bookId' });

// User <-> AuditLog
User.hasMany(AuditLog, { foreignKey: 'userId', as: 'auditLogs', onDelete: 'SET NULL' });
AuditLog.belongsTo(User, { foreignKey: 'userId', as: 'actor' });

// User <-> CartItems
User.hasMany(CartItem, { foreignKey: 'userId', onDelete: 'CASCADE' });
CartItem.belongsTo(User, { foreignKey: 'userId' });

// Book <-> CartItems
Book.hasMany(CartItem, { foreignKey: 'bookId' });
CartItem.belongsTo(Book, { foreignKey: 'bookId' });

// User <-> Orders
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

// Admin Audit mapping
Order.belongsTo(User, { as: 'adminUpdater', foreignKey: 'updatedBy' });

// Order <-> OrderItems
Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

// Book <-> OrderItems
Book.hasMany(OrderItem, { foreignKey: 'bookId' });
OrderItem.belongsTo(Book, { foreignKey: 'bookId' });

export {
  sequelize,
  User,
  Book,
  BookImage,
  CartItem,
  Order,
  OrderItem,
  Category,
  Coupon,
  Banner,
  ContactMessage,
  Wishlist,
  AuditLog
};

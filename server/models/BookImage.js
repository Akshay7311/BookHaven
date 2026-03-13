import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const BookImage = sequelize.define('BookImage', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  bookId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'books',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false
  },
  isPrimary: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'book_images',
  updatedAt: false // Schema requests only created_at for this table conceptually, but keeping timestamps true in setup is fine. Let's disable updated_at if not requested.
});

export default BookImage;

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  paymentStatus: {
    type: DataTypes.ENUM('unpaid', 'paid', 'refunded'),
    defaultValue: 'unpaid'
  },
  shippingAddress: {
    type: DataTypes.TEXT, // Stringified JSON: { fullName, address, city, zip, phone }
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.ENUM('COD', 'Card', 'PayPal'),
    defaultValue: 'COD'
  },
  paymentResult: {
    type: DataTypes.TEXT, // For storing transaction IDs or status from gateway
    allowNull: true
  },
  shippingPrice: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0.00
  },
  trackingNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  carrierName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  updatedBy: {
    type: DataTypes.UUID,
    allowNull: true // For admin audit logic
  }
}, {
  tableName: 'orders'
});

export default Order;

import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Banner = sequelize.define('Banner', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  subtitle: {
    type: DataTypes.STRING,
    allowNull: true
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  link_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: 'bg-blue-900'
  },
  btnColor: {
    type: DataTypes.STRING,
    defaultValue: 'bg-primary-600 hover:bg-primary-700'
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_system: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'banners',
  timestamps: true
});

export default Banner;

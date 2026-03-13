import { Coupon } from '../models/index.js';
import { Op } from 'sequelize';

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.findAll({ order: [['createdAt', 'DESC']] });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const { code, discount_percentage, expiry_date, is_active } = req.body;
    const coupon = await Coupon.create({ code: code.toUpperCase(), discount_percentage, expiry_date, is_active });
    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ message: 'Error creating coupon. Code might exist.' });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    
    // Auto uppercase if code is present
    if (req.body.code) req.body.code = req.body.code.toUpperCase();
    await coupon.update(req.body);
    
    res.json(coupon);
  } catch (error) {
    res.status(400).json({ message: 'Error updating coupon.' });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByPk(req.params.id);
    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
    await coupon.destroy();
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ 
        where: { 
            code: code.toUpperCase(),
            is_active: true,
            expiry_date: { [Op.gt]: new Date() }
        } 
    });
    
    if (!coupon) return res.status(400).json({ message: 'Invalid or expired coupon' });
    
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

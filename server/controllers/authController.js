import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { sendEmail } from '../utils/emailService.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Restriction: Only allow the Ethereal account to register (per user request)
    if (email !== process.env.MAIL_USER && email !== 'admin@bookhaven.com' && email !== 'owner@bookhaven.com') {
      return res.status(401).json({ message: 'Registration is restricted for this store.' });
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // If it's the first user ever, make them admin
    const userCount = await User.count();
    const role = userCount === 0 ? 'admin' : 'user';

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    // Send Welcome Email
    try {
      await sendEmail(
        user.email,
        'Welcome to BookHaven!',
        `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
          <h1 style="color: #1a1a1a; text-align: center;">Welcome to BookHaven, ${user.name}!</h1>
          <p>We're thrilled to have you join our community of book lovers.</p>
          <p>You can now browse our extensive collection, create a wishlist, and place orders for your favorite books.</p>
          <div style="text-align: center; margin-top: 30px;">
            <a href="${process.env.CLIENT_URL}" style="background: #1a1a1a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Start Browsing</a>
          </div>
          <p style="margin-top: 40px; font-size: 12px; color: #666; text-align: center;">© 2026 BookHaven Bookstore. All rights reserved.</p>
        </div>`
      );
    } catch (emailError) {
      console.error('[Welcome Email Error]:', emailError);
    }

    res.status(201).json({
      _id: user.id, // return UUID mapped to _id for frontend compat
      name: user.name,
      email: user.email,
      role: user.role,
      token: jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' }),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id, // Return UUID
        name: user.name,
        email: user.email,
        role: user.role,
        token: jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '30d' }),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'name', 'email', 'role']
    });
    if(user) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

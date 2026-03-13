import { ContactMessage } from '../models/index.js';

export const getMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.findAll({ order: [['createdAt', 'DESC']] });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    const newMessage = await ContactMessage.create({ name, email, subject, message });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(400).json({ message: 'Error submitting message.' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const message = await ContactMessage.findByPk(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    message.is_read = true;
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const message = await ContactMessage.findByPk(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    await message.destroy();
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

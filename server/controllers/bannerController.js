import { Banner } from '../models/index.js';
import path from 'path';

export const getBanners = async (req, res) => {
  try {
    // Only return active banners for public view unless requested by admin?
    // Let's assume frontend will fetch all and filter, or we return active
    const isAdmin = req.user && req.user.role === 'admin';
    const whereClause = isAdmin ? {} : { is_active: true };

    const banners = await Banner.findAll({ where: whereClause, order: [['createdAt', 'DESC']] });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createBanner = async (req, res) => {
  try {
    const { title, subtitle, link_url, color, btnColor, is_active } = req.body;
    let image_url = '';
    
    if (req.file) {
      if (req.file.path.startsWith('http')) {
        image_url = req.file.path; // Cloudinary
      } else {
        image_url = '/covers/' + path.basename(req.file.path); // Local
      }
    } else if (req.body.image_url) {
      image_url = req.body.image_url;
    }

    if (!image_url) {
       return res.status(400).json({ message: 'Banner image is required' });
    }

    const banner = await Banner.create({ 
      title, 
      subtitle, 
      image_url, 
      link_url, 
      color, 
      btnColor, 
      is_active 
    });
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    
    let { title, subtitle, link_url, color, btnColor, is_active } = req.body;
    let image_url = banner.image_url;
    
    if (req.file) {
      if (req.file.path.startsWith('http')) {
        image_url = req.file.path; // Cloudinary
      } else {
        image_url = '/covers/' + path.basename(req.file.path); // Local
      }
    } else if (req.body.image_url !== undefined) {
      image_url = req.body.image_url;
    }

    await banner.update({ title, subtitle, image_url, link_url, color, btnColor, is_active });
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);
    if (!banner) return res.status(404).json({ message: 'Banner not found' });
    
    if (banner.is_system) {
        return res.status(403).json({ message: 'System banners cannot be deleted' });
    }

    await banner.destroy();
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

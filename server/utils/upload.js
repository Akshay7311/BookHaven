import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config();

// Configuration for Cloudinary if credentials exist, otherwise fallback to local for dev
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || 'api_key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'api_secret'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'bookhaven_covers',
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 800, height: 1200, crop: 'limit' }]
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
});

// Admin upload route helper
export const deleteImage = async (imageUrl) => {
    try {
        if(!imageUrl.includes('res.cloudinary.com')) return;
        // Extract public ID from URL
        const parts = imageUrl.split('/');
        const filename = parts[parts.length - 1];
        const publicId = filename.split('.')[0];
        await cloudinary.uploader.destroy(`bookhaven_covers/${publicId}`);
    } catch(err) {
        console.error("Cloudinary delete failed:", err);
    }
}

export default upload;

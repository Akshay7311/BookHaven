import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const __dirname = path.resolve();
const LOCAL_UPLOAD_DIR = path.join(__dirname, '../client/public/covers');

// Ensure directory exists if using local storage
if (!fs.existsSync(LOCAL_UPLOAD_DIR)) {
  fs.mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });
}

const isCloudinaryConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

let storage;

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'bookhaven_covers',
      allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
      transformation: [{ width: 800, height: 1200, crop: 'limit' }]
    }
  });
  console.log('✅ Upload system: Using Cloudinary Storage');
} else {
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, LOCAL_UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, 'cover-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
  console.log('💡 Upload system: Falling back to Local Disk Storage (../client/public/covers)');
}

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Modify for local storage path mapping for DB entry
    // We adjust the `path` property so the DB stores the web-accessible URL
    const originalCb = cb;
    cb = (err, accept) => {
        if(accept && !isCloudinaryConfigured) {
           // We'll calculate this later in the controller or here
        }
        originalCb(err, accept);
    };
    cb(null, true);
  },
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB Limit
});

// Admin upload route helper
export const deleteImage = async (imageUrl) => {
    try {
        if (imageUrl.includes('res.cloudinary.com')) {
            const parts = imageUrl.split('/');
            const filename = parts[parts.length - 1];
            const publicId = filename.split('.')[0];
            await cloudinary.uploader.destroy(`bookhaven_covers/${publicId}`);
        } else if (imageUrl.startsWith('/covers/')) {
            const filename = imageUrl.replace('/covers/', '');
            const fullPath = path.join(LOCAL_UPLOAD_DIR, filename);
            if (fs.existsSync(fullPath)) {
                fs.unlinkSync(fullPath);
            }
        }
    } catch(err) {
        console.error("Image delete failed:", err);
    }
}

export default upload;

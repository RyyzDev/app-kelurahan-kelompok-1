import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

// Konfigurasi penyimpanan dinamis
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    if (req.baseUrl.includes('/events')) {
      uploadPath += 'event';
    } else if (req.baseUrl.includes('/umkm')) {
      uploadPath += 'produk';
    } else {
      // Default or fallback directory
      uploadPath += 'general';
    }

    // Ensure the directory exists
    fs.mkdirSync(uploadPath, { recursive: true });
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    const prefix = req.baseUrl.includes('/events') ? 'event' : 'produk';
    cb(null, `${prefix}-${Date.now()}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// Filter file
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Hanya diperbolehkan mengupload gambar (jpeg/jpg/png/webp)'));
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

export default upload;

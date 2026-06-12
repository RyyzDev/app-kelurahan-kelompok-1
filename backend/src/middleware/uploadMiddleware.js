import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

// Konfigurasi penyimpanan
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/produk');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    cb(null, `produk-${Date.now()}-${uniqueSuffix}${path.extname(file.originalname)}`);
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

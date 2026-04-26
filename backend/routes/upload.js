// Local image upload route for MiniStore
const express = require('express');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();
const uploadsDir = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

function sanitizeFilename(filename) {
  const baseName = path.basename(filename, path.extname(filename));
  return baseName
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'image';
}

// Configure multer for disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate safe unique filename from timestamp + sanitized original name
    const uniquePrefix = Date.now();
    const safeName = sanitizeFilename(file.originalname);
    const ext = path.extname(file.originalname);
    cb(null, `${uniquePrefix}-${safeName}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error('Invalid file type. Only JPG, PNG, WEBP, and GIF files are allowed.');
      error.code = 'LIMIT_FILE_TYPE';
      return cb(error, false);
    }

    cb(null, true);
  }
});

// Upload endpoint (for backward compatibility, but now products handle uploads)
router.post('/', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Return the local URL
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.json({
      message: 'Image uploaded successfully',
      imageUrl,
      publicId: req.file.filename
    });

  } catch (error) {
    console.error('Upload error:', error);

    if (error.code === 'LIMIT_FILE_TYPE') {
      return res.status(400).json({ error: error.message });
    }

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum size is 5MB.' });
    }

    res.status(500).json({
      error: 'Failed to upload image',
      details: error.message
    });
  }
});

// Delete local image endpoint
router.delete('/:publicId', requireAdmin, async (req, res) => {
  try {
    const { publicId } = req.params;
    const imagePath = path.join(uploadsDir, publicId);
    await fs.promises.unlink(imagePath);

    res.json({ message: 'Image deleted successfully' });

  } catch (error) {
    if (error.code === 'ENOENT') {
      return res.status(404).json({ error: 'Image not found.' });
    }

    console.error('Image delete error:', error);
    res.status(500).json({
      error: 'Failed to delete image',
      details: error.message
    });
  }
});

module.exports = { router, upload };

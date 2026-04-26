// Cloudinary image upload route for MiniStore
const express = require('express');
const multer = require('multer');
const streamifier = require('streamifier');
const cloudinary = require('cloudinary').v2;
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  return process.env.CLOUDINARY_CLOUD_NAME && 
         process.env.CLOUDINARY_API_KEY && 
         process.env.CLOUDINARY_API_SECRET;
};

// Configure multer for memory storage (we'll stream directly to Cloudinary)
const storage = multer.memoryStorage();

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

// Upload endpoint
router.post('/', requireAdmin, upload.single('image'), async (req, res) => {
  try {
    // Check if Cloudinary is configured
    if (!isCloudinaryConfigured()) {
      return res.status(500).json({ 
        error: 'Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create a stream from the buffer
    const stream = streamifier.createReadStream(req.file.buffer);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: 'mini-ecommerce/products', // Organize images in a folder
          format: 'webp', // Convert to webp for better compression
          quality: 'auto:good', // Automatic quality optimization
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.pipe(uploadStream);
    });

    // Return the secure URL from Cloudinary
    res.json({
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url,
      publicId: result.public_id
    });

  } catch (error) {
    console.error('Cloudinary upload error:', error);
    
    if (error.code === 'LIMIT_FILE_TYPE') {
      return res.status(400).json({ error: error.message });
    }
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum size is 5MB.' });
    }
    
    res.status(500).json({ 
      error: 'Failed to upload image to Cloudinary',
      details: error.message 
    });
  }
});

// Delete image endpoint (for future use)
router.delete('/:publicId', requireAdmin, async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!isCloudinaryConfigured()) {
      return res.status(500).json({ 
        error: 'Cloudinary is not configured.' 
      });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    res.json({ message: 'Image deleted successfully' });

  } catch (error) {
    console.error('Cloudinary delete error:', error);
    res.status(500).json({ 
      error: 'Failed to delete image from Cloudinary',
      details: error.message 
    });
  }
});

module.exports = router;

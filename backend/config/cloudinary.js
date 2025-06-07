// /utils/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// config/cloudinary.js

require('dotenv').config(); 


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});




const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'formations', // nom du dossier Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
    transformation: [{ width: 800, height: 600, crop: 'limit' }],
  },
});

module.exports = { cloudinary, storage };

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'MeetingMind_Files', // Folder ka naam generic rakha hai kyunki ab video bhi aayegi
    resource_type: 'auto',       // Ye 'auto' hona bahut zaroori hai (Audio/Video detect karne ke liye)
    allowed_formats: ['mp3', 'wav', 'm4a', 'mp4', 'mpeg', 'webm', 'ogg'], // Saare formats allow kar diye
  },
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // Limit: 50MB (Video files thodi badi hoti hain isliye limit badha di)
  }
});

module.exports = { upload };
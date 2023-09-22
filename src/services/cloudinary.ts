import * as cloudinary from 'cloudinary';

const Cloudinary = cloudinary.v2;
Cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  cloud_name: process.env.CLOUDINARY_NAME,
});

export default Cloudinary;

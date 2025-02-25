import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Set up storage for multer (storing temporarily in memory)
const upload = multer({ storage: multer.memoryStorage() });

// Define available sizes
const sizes = [
  { width: 300, height: 250 },
  { width: 728, height: 90 },
  { width: 160, height: 600 },
  { width: 300, height: 600 },
];

// Helper function to handle multer file upload
const handleUpload = (req, res) => {
  return new Promise((resolve, reject) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Handle file upload
      await handleUpload(req, res);

      // Create a directory for uploads if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Process and save images in different sizes
      const processedImages = await Promise.all(
        sizes.map(async (size) => {
          const fileName = `image_${size.width}x${size.height}.jpg`;
          const filePath = path.join(uploadDir, fileName);
          await sharp(req.file.buffer)
            .resize(size.width, size.height,{fit: 'fill'})
            .toFormat('jpeg')
            .toFile(filePath);
          return { size: `${size.width}x${size.height}`, path: `/uploads/${fileName}` };
        })
      );

      res.status(200).json({ success: true, images: processedImages });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: error.message });
    }
  } else {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  }
}

export const config = {
  api: {
    bodyParser: false, // Disable body parsing, consume as stream
  },
};
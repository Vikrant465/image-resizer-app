import multer from 'multer';
import sharp from 'sharp';

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

      // Process images in different sizes in memory without saving to disk.
      // For each size, we convert the processed image buffer to a base64 string
      // which can be used as a data URL in the browser.
      const processedImages = await Promise.all(
        sizes.map(async (size) => {
          const buffer = await sharp(req.file.buffer)
            .resize(size.width, size.height, { fit: 'fill' })
            .toFormat('jpeg')
            .toBuffer();
          
          // Convert the buffer to a base64 string
          const base64Image = buffer.toString('base64');
          const dataUrl = `data:image/jpeg;base64,${base64Image}`;
          
          return { size: `${size.width}x${size.height}`, dataUrl };
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

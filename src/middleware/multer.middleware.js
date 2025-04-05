import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (_req, file, cb) {
    // Create type-specific subdirectories
    const typeDir = path.join(uploadDir, file.fieldname + 's');
    if (!fs.existsSync(typeDir)) {
      fs.mkdirSync(typeDir);
    }
    cb(null, typeDir);
  },
  filename: function (_req, file, cb) {
    const randomName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, file.fieldname + "-" + randomName + ext);
  }
});

// File filter to allow only certain types
const fileFilter = (_req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|mp4|mov|avi|mkv|webm/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error(`Error: Only ${filetypes.toString()} files are allowed!`));
  }
};

// Configure multer with limits for large files
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 500,
    files: 1 // Single file upload
  }
});

// Middleware to handle different upload types
const uploadMiddleware = (fieldName, resourceType) => {
  return (req, res, next) => {
    const uploadSingle = upload.single(fieldName);
    
    uploadSingle(req, res, function(err) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: `No ${fieldName} file uploaded`
        });
      }
      
      req.resourceType = resourceType;
      next();
    });
  };
};

export default uploadMiddleware;
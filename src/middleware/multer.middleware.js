import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../../public/uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (_req, file, cb) {
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

const fileFilter = (_req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|mp4|mov|avi|mkv|webm/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error(`Only ${filetypes.toString()} files are allowed!`));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 500, // 500MB
  }
});

// Middleware to handle multiple fields
export const uploadFields = upload.fields([
  { name: "video", maxCount: 1 },
  { name: "image", maxCount: 1 },
]);

export default upload;

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_SECRET,
} from "../config/config.js";

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error("Cloudinary configuration error: Missing required environment variables.");
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const cloudinaryUpload = async (filePath, public_id, folder, resourceType = "image") => {
  let uploadResult;

  try {
    uploadResult = await cloudinary.uploader.upload(filePath, {
      public_id,
      folder,
      resource_type: resourceType,
      chunk_size: 6000000, // 6MB chunks for video uploads
      timeout: 120000, // 2 minutes timeout
    });

    fs.unlinkSync(filePath);
    return uploadResult;
  }

  catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error("Cloudinary upload error:", error);
    throw new Error(`File upload failed: ${error.message}`);
  }
};

const cloudinaryDelete = async (public_id, resourceType = "image") => {
  try {
    await cloudinary.uploader.destroy(public_id, {
      resource_type: resourceType
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error(`File deletion failed: ${error.message}`);
  }
};

export { cloudinaryUpload, cloudinaryDelete };
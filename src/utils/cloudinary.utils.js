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

const cloudinaryUploadImage = async (filePath, public_id, folder) => {
  let uploadResult;

  try {
    uploadResult = await cloudinary.uploader.upload(filePath, {
      public_id,
      folder,
      resource_type: "image",
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

const cloudinaryUploadVideo = async (filePath, public_id, folder) => {
  let uploadResult;

  try {
    uploadResult = await cloudinary.uploader.upload(filePath, {
      public_id,
      folder,
      resource_type: "video",
      eager_async: true, // This offloads transformation to background
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

const cloudinaryDelete = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id, {
      resource_type: "auto"
    });
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    throw new Error(`File deletion failed: ${error.message}`);
  }
};

export { cloudinaryUploadImage, cloudinaryUploadVideo, cloudinaryDelete };
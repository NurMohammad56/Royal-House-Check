import dotenv from "dotenv"

dotenv.config()

export const MONGODB_URI = process.env.MONGODB_URI

export const PORT = Number(process.env.PORT)

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET

export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY

export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET

export const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;

export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;

export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;   

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;


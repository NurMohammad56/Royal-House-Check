import dotenv from "dotenv"

dotenv.config()

export const MONGODB_URI = process.env.MONGODB_URI

export const PORT = Number(process.env.PORT)

export const SECRET = process.env.SECRET

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET

export const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY

export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET

export const REFRESH_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY
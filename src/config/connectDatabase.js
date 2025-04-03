import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";

export default async function connectDatabase() {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1)
    }
}
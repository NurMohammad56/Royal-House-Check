import { Schema } from "mongoose";

const authSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 20,
        match: /^[a-zA-Z0-9]+$/,
    },
    password: {
        type: String,

    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
})

export const Auth = mongoose.model("Auth", authSchema);
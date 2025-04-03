import { Schema } from "mongoose";

const authSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    password: {
        type: String,

    },
    email: {
        type: String,
        unique: true
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
})

export const Auth = mongoose.model("Auth", authSchema);
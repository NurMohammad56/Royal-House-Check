import mongoose,{ Schema } from "mongoose";


import { ACCESS_TOKEN_EXPIRY, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRY, REFRESH_TOKEN_SECRET } from "../config/config.js";

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ["admin", "client"],
        default: "client",
    },
    refreshToken: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode: String,
    verificationCodeExpires: Date,
    resetPasswordToken: String,
    resetPasswordExpires: Date
},
    { timestamps: true }
)

// Hashing password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Password comparison method (bcrypt)
userSchema.methods.isPasswordValid = function (password) {
    if (!password || !this.password) {
        throw new Error("Password or hashed password is missing");
    }

    return bcrypt.compare(password, this.password);
};

// Generate verification code
userSchema.methods.generateVerificationCode = function () {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.verificationCode = crypto.createHash("sha256").update(code).digest("hex");
    this.verificationCodeExpires = Date.now() + 10 * 60 * 1000;
    return code;
};

// Generate password reset token
userSchema.methods.generatePasswordResetToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpires = Date.now() + 15 * 60 * 1000; 
    return resetToken;
};

// Generate ACCESS_TOKEN
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            fullname: this.fullname,
            email: this.email
        },
        ACCESS_TOKEN_SECRET,
        {
            expiresIn: ACCESS_TOKEN_EXPIRY,
        }
    );
};

// Generate REFRESH_TOKEN
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            id: this._id,
            fullname: this.fullname,
            email: this.email
        },
        REFRESH_TOKEN_SECRET,
        {
            expiresIn: REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);
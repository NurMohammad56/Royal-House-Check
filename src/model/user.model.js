import { Schema } from "mongoose";

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
        enum: ["admin", "user"],
        default: "user",
    },
})

// Hashing password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    // const salt = await this.getSalt(10);
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

// Generate ACCESS_TOKEN
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

// Generate REFRESH_TOKEN
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);
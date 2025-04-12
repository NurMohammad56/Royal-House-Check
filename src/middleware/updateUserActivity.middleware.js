import { User } from "../model/user.model.js";

export const updateUserActivity = async (req, res, next) => {
    if (req.user) { 
        await User.findByIdAndUpdate(req.user._id, {
            lastActive: new Date(),
            status: "active", 
        });
    }
    next();
};
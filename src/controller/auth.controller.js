import { User } from "../model/user.model.js";

export const register = async (req, res, next) => {
    try {
      const { fullname, email, password } = req.body;

      if (!email || !password || !fullname) { 
        return res.status(400).json({status:false, message: "All fields are required." })
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({ status: false, message: "Email already exists." });
      }

      const user = new User({ fullname, email, password });
      await user.save();

      return res.status(201).json({ status: true, message: "User registered successfully.", data:user });
    }
    catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        //code to login user goes here
    }

    catch (error) {
        next(error);
    }
}

export const logout = async (req, res, next) => {
    try {
        //code to logout user goes here
    }

    catch (error) {
        next(error);
    }
}

export const refreshAccessToken = async (req, res, next) => {
    try {
        //code to refresh access token goes here
    }

    catch (error) {
        next(error);
    }
}

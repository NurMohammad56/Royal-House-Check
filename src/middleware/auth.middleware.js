import jwt from "jsonwebtoken";
import { User } from "../model/user.model.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: false,
        message: "Authorization header missing or improperly formatted",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token || token.split('.').length !== 3) {
      return res.status(400).json({
        status: false,
        message: "Malformed token",
      });
    }

    let decodedToken;

    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({
        status: false,
        message: "Invalid or expired token",
      });
    }

    const user = await User.findById(decodedToken?.id).select("-password");

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

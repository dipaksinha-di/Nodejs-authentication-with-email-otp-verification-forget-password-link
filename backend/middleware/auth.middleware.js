import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies.token || req.header("Authrization")?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access : No token found ",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access : User not found ",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Invalid token",
    });
  }
};

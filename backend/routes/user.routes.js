import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  profileUser,
  getAllUsers,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logoutUser);
userRouter.get("/profile", authMiddleware, profileUser);
userRouter.get("/all-users", getAllUsers);
export default userRouter;

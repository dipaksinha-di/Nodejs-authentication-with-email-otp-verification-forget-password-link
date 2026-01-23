import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// register user
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username) {
      return res.status(400).json({ message: "username is required" });
    }
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "password is required" });
    }

    // existing user check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hashing password
    const ganerateHashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: username,
      email,
      password: ganerateHashedPassword,
    });

    await newUser.save();

    const { password: pass, ...userData } = newUser._doc;
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "server error while registering user",
    });
  }
};

// login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    if (!password) {
      return res.status(400).json({ message: "password is required" });
    }

    //  user check
    const AlreadyUser = await User.findOne({ email });
    if (!AlreadyUser) {
      return res
        .status(400)
        .json({ success: false, message: "user does not exist" });
    }

    // password match
    const isMatch = await bcrypt.compare(password, AlreadyUser.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "invalid credentials" });
    }

    const token = jwt.sign({ _id: AlreadyUser.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    const { password: pass, ...userData } = AlreadyUser._doc;
    return res.status(201).cookie("token", token, options).json({
      success: true,
      message: "Login successfully",
      user: userData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while login",
    });
  }
};

// logout user
export const logoutUser = async (req, res) => {
  try {
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    return res.clearCookie("token", options).status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while logout",
    });
  }
};

// profile user
export const profileUser = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user does not exist" });
    }
    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user: req.user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching profile",
    });
  }
};

// get All Users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching all users",
    });
  }
};

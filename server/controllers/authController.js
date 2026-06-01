import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// generate the token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register User
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check if required fields are present
    if (!name || !email || !password) {
      return res.status(400).json({success: false,  message: "Missing required fields" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({success: false,  message: "User already exists" });
    }

    // Create new user
    const hashedPassword = await bcrypt.hash(
      password,
      await bcrypt.genSalt(10),
    );

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Return success message
    const token = generateToken(user._id);

    return res.status(201).json({ success: true, token, user });
  } catch (error) {
    console.error("Register Error", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if required fields are present
    if (!email || !password) {
      return res.status(400).json({success: false,  message: "Missing required fields" });
    }

    // Check if user already exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({success: false,  message: "Invalid Credentials" });
    }

    // Check Password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    // Return success message
    const token = generateToken(user._id);

    return res.status(201).json({ success: true, token, user });
  } catch (error) {
    console.error("Register Error", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get current User
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");

    if (!user) {
      return res.status(404).json({success: false, message: "User not found" });
    }

    // Return user
    return res.status(200).json({success: true, user });
  } catch (error) {
    console.error("Get user error:", error.message);
    return res.status(500).json({success: false, message: "Server error" });
  }
};

import bcrypt from 'bcrypt';
import userModel from "../models/userModel.js";
import validator from "validator";
import jwt from 'jsonwebtoken';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3d' }); // Set expiration time
};

// Route for user login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "Incorrect email or password" });
        }

        // Compare the entered password with the hashed password
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.json({ success: false, message: "Incorrect email or password" });
        }

        // Create a JWT token
        const token = createToken(user._id);

        res.json({ success: true, token });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server error" });
    }
};

// Route for user register
const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com"];

const registerUser = async (req, res) => {
  try {
    const { name, email, password, password_confirmation } = req.body;

    // Checking if user already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User already registered" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email address" });
    }

    // Extract domain from email
    const emailDomain = email.split("@")[1];

    // Check if domain is allowed
    if (!allowedDomains.includes(emailDomain)) {
      return res.json({
        success: false,
        message: `Email domain not allowed. Please use a valid email like @gmail.com, @yahoo.com, etc.`,
      });
    }

    // Validate password (at least one uppercase, one number, and minimum 8 characters)
    if (!/^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password)) {
      return res.json({
        success: false,
        message: "Password must contain at least one uppercase letter, one number, and be at least 8 characters long",
      });
    }

    // Check if passwords match
    if (password !== password_confirmation) {
      return res.json({ success: false, message: "Passwords do not match" });
    }

    // Hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      password_confirmation: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    res.json({ success: true, token });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Route for admin login (optional implementation)
const adminLogin = async (req, res) => {
  try {
    
    const {email,password}=req.body
    if (email === process.env.ADMIN_EMAIL && password=== process.env.ADMIN_PASSWORD) {
        const token = jwt.sign(email+password,process.env.JWT_SECRET);
        res.json({success:true,token})
    }
    else{
        res.json({success:false,message:"Invalid Credentials"})
    }

  } catch (error) {
    console.log(error);
        res.json({ success: false, message: error.message });
  }
};
const getUserProfile = async (req, res) => {
  try {
    const token = req.headers.token;
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select("name email");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to get user info" });
  }
};
const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const token = req.headers.token;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({ success: true, message: "Profile updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};


export { loginUser, registerUser, adminLogin, getUserProfile, updateUserProfile };

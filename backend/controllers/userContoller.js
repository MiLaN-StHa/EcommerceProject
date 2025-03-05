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
            return res.status(400).json({ success: false, message: "User does not exist" });
        }

        // Compare the entered password with the hashed password
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Create a JWT token
        const token = createToken(user._id);

        res.status(200).json({ success: true, token });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// Route for user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Checking if user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "User Already Exists" });
        }

        // Validating email and password
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please Enter a Valid Email" });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: "Please Enter a Strong Password" });
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();
        const token = createToken(user._id);

        res.status(200).json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
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
        res.status(500).json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin };

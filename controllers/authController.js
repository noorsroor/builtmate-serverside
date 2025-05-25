
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs') ;
const { validationResult } = require("express-validator");
const { registerValidation } =require( "../validation/userValidation.js");
const User = require('../models/userModel.js');
const nodemailer = require("nodemailer");
const Joi =require("joi");
const crypto = require("crypto");

const otpStorage = new Map();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});


//🟥 Register User
exports.register = async (req, res) => {
  try {

    //JOI VALIDATION🚫
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({ message: error.details.map((err) => err.message) });

    //USED EMAIL 🚫
    const existingEmail = await User.findOne({ email: req.body.email });
    if (existingEmail) {
      return res.status(400).json({ message: ["This email is already registered. Try logging in."] });
    }

    //USED PHONE NUMBER🚫
    const existingPhone = await User.findOne({ phone: req.body.phone });
    if (existingPhone) {
      return res.status(400).json({ message: ["This phone number is already registered. Use another number."] });
    }

    //GET DATA FROM THE BODY ✅
    const { firstname, lastname, email, password, phone, address } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    //CREATE NEW USER✅
    const newUser = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      phone,
      address,
    });
    //SAVE THE USER IN MONGODB✅
    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//🟥 Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect Password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "strict" });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//🟥 Logout User
exports.logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};

//🟥 Get Authenticated User
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//🟥 Forgot Password Function
exports.forgotPassword = async (req, res) => {
  try {
    const  email= req.body.email
    const schema = Joi.object({ email: Joi.string().email().required() });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate OTP (6-digit random number)
    const otp = crypto.randomInt(1000, 9999).toString();

    // Store OTP temporarily (expires in 1 mins)
    otpStorage.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });
    // Setup email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email message
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "BuiltMate Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. It expires in 1 minute.`,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent to your email" });
    } catch (error) {
      console.log(error.message )
    res.status(500).json({ message: "Error sending OTP", error: error.message });
    
    }
};

//🟥 verifyOtp function
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const storedOtp = otpStorage.get(email);

  if (!storedOtp || storedOtp.otp !== otp) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  // OTP is valid, allow user to proceed to password reset
  res.status(200).json({ message: "OTP verified. Proceed to reset password" });
};


//🟥 Reset Password Function
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
     // Check if OTP was verified
    if (!otpStorage.has(email)) {
      return res.status(400).json({ message: "OTP verification required" });
    } 

     // Remove OTP after verification
     otpStorage.delete(email);

    const passwordComplexity = Joi.string()
      .min(8)
      .max(30)
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$"))
      .message("Password must contain at least 8 characters, one uppercase, one lowercase, and one number.");

    const schema = Joi.object({
      email: Joi.string().email().required(),
      newPassword: passwordComplexity.required(),
    rePassword: Joi.ref("password"), // Ensures passwords match,
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ message: "Error resetting password", error: error.message });
  }
};


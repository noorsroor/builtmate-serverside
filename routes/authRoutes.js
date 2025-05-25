const express = require('express');
const { register, login, logout, getUser, forgotPassword,verifyOtp, resetPassword } = require( '../controllers/authController.js');
const { verifyToken } = require( '../middleware/authMiddleware.js');
const { body } = require( 'express-validator');

const router = express.Router();

router.post(
  "/register",
  [
    body("firstname").notEmpty().withMessage("firstname is required"),
    body("lastname").notEmpty().withMessage("lastrname is required"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  register
);
router.post("/login", login);
router.post("/logout", logout);
router.get("/user", verifyToken, getUser);


// Forgot Password 
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

module.exports= router;

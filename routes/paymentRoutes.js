// const express =require( "express");
// const { createCheckoutSession, handleWebhook, getUserPayments } =require( "../controllers/paymentController.js");
// const { verifyToken } =require( "../middleware/authMiddleware.js");
// const bodyParser =require( "body-parser");

// const router = express.Router();

// // Payment session creation
// router.post("/create-checkout-session", verifyToken, createCheckoutSession);

// // Get user payment history
// router.get("/my-payments", verifyToken, getUserPayments);

// // Stripe webhook (must use raw body)
// router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);


// module.exports = router;


const express = require("express");
const { processPayment } = require("../controllers/paymentController");

const router = express.Router();

router.post("/charge", processPayment);

module.exports = router;

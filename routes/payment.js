const { createStripePayment, createPaypalPayment } = require("../controllers/paymentsController");
const express = require("express");
const router = express.Router();

router.post("/stripe", createStripePayment);
router.post("/paypal", createPaypalPayment);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  createBooking,
  getBookingsByUser,
  getBookingsByPro,
  payForBooking,
  getSingleBooking,
  submitQuote
} = require("../controllers/bookingController");

router.post("/", createBooking);
router.get("/user/:userId", getBookingsByUser);
router.get("/pro/:proId", getBookingsByPro);
router.get("/:id", getSingleBooking);
router.post("/pay/:bookingId", payForBooking);
router.put("/quote/:bookingId", submitQuote);

module.exports = router;

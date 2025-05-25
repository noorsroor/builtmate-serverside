const express = require("express");
const router = express.Router();
const { addReview } = require("../controllers/reviewController");

// POST /api/reviews
router.post("/", addReview);

module.exports = router;
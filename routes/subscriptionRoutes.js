const express = require("express");
const { createSubscription,isPremiumPlan } = require("../controllers/subscriptionController");

const router = express.Router();

router.post("/", createSubscription);
router.get("/is-premium/:proId", isPremiumPlan);

module.exports = router;

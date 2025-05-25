const Subscription = require("../models/Subscription");
const User = require('../models/userModel.js');
const Professional = require("../models/Professional");

exports.isPremiumPlan = async (req, res) => {
  try {
    const { proId } = req.params;

    // 1. Find the Professional
    const pro = await Professional.findById(proId);
    if (!pro) return res.status(404).json({ error: "Professional not found" });

    // 2. Get the linked user ID
    const userId = pro.userId;

    // 3. Find the active subscription for the user
    const subscription = await Subscription.findOne({ user: userId, status: "active" });
    if (!subscription) return res.status(200).json({ isPremium: false });

    // 4. Check if the plan is Premium
    const isPremium = subscription.plan === "Premium";

    res.status(200).json({ isPremium });
  } catch (err) {
    console.error("Error checking premium plan:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.createSubscription = async (req, res) => {
    try {
      const { userId, plan, billingCycle, amountPaid } = req.body;
  
      // Set subscription end date based on billing cycle
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + (billingCycle === "monthly" ? 1 : 12));
  
      const subscription = new Subscription({
        user: userId,
        plan,
        billingCycle,
        amountPaid,
        endDate,
      });
  
      const savedSubscription= await subscription.save();

    // ✅ Update user's subscription reference
    await User.findByIdAndUpdate(userId, {
      subscription: savedSubscription._id,
    });

      res.json({ message: "Subscription created successfully", subscription });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
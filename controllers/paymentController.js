// const Stripe =require( "stripe");
// const dotenv =require( "dotenv");
// const Payment =require( "../models/PaymentMethod.js");
// const User =require( "../models/UserModel.js");

// dotenv.config();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// // Create a new payment session
// exports.createCheckoutSession = async (req, res) => {
//   try {
//     const { planType } = req.body;
//     const userId = req.user.id;

//     // Define plan prices
//     const prices = {
//       basic: 1000, // $10.00
//       premium: 2000, // $20.00
//     };

//     if (!prices[planType]) {
//       return res.status(400).json({ message: "Invalid plan type" });
//     }

//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       mode: "payment",
//       success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
//       line_items: [
//         {
//           price_data: {
//             currency: "usd",
//             product_data: {
//               name: `BuiltMate ${planType} Plan`,
//             },
//             unit_amount: prices[planType],
//           },
//           quantity: 1,
//         },
//       ],
//       metadata: { userId, planType },
//     });

//     // Save the payment details in the database
//     const payment = new Payment({
//       userId,
//       planType,
//       amount: prices[planType],
//       currency: "usd",
//       stripeSessionId: session.id,
//       status: "pending",
//     });

//     await payment.save();
//     res.json({ url: session.url });
//   } catch (error) {
//     console.error("Payment Error:", error);
//     res.status(500).json({ message: "Payment processing error" });
//   }
// };

// // Handle Stripe Webhook (to confirm payment)
// exports.handleWebhook = async (req, res) => {
//     const sig = req.headers["stripe-signature"];

//     try {
//         // 👉 Webhook Verification (Use raw body, NOT parsed JSON)
//         const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

//         console.log("🔹 Webhook received:", event.type);

//         if (event.type === "checkout.session.completed") {
//             const session = event.data.object;

//             // Find the payment record in the database
//             const payment = await Payment.findOne({ stripeSessionId: session.id });

//             if (payment) {
//                 payment.status = "completed";
//                 payment.paymentIntentId = session.payment_intent;
//                 await payment.save();

//                 // Upgrade user subscription
//                 await User.findByIdAndUpdate(payment.userId, {
//                     $set: { "subscription.plan": payment.planType, "subscription.active": true },
//                 });

//                 console.log("✅ Payment processed for:", session.customer_email);
//             } else {
//                 console.warn("⚠️ No matching payment found for session ID:", session.id);
//             }
//         }

//         res.json({ received: true });
//     } catch (error) {
//         console.error("❌ Webhook Error:", error.message);
//         res.status(400).json({ message: "Webhook processing failed" });
//     }
// };

// // Get payment history for a user
// exports.getUserPayments = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const payments = await Payment.find({ userId }).sort({ createdAt: -1 });
//     res.json(payments);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch payments" });
//   }
// };


const Payment = require("../models/PaymentMethod");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


exports.processPayment = async (req, res) => {
  try {
    const { userId, planType, amount } = req.body;

    // Validate input
    if (!userId || !planType || !amount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Frontend should send amount in cents
      currency: "usd",
      payment_method_types: ["card"],
      metadata: {
        userId: userId,
        planType: planType
      }
    });

    // Save payment in database
    const payment = new Payment({
      userId,
      planType,
      amount: amount / 100, // Store in dollars in DB
      currency: "usd",
      stripeSessionId: paymentIntent.id,
      paymentIntentId: paymentIntent.id,
      status: "pending"
    });

    await payment.save();

    res.json({ 
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id 
    });

  } catch (error) {
    console.error("Payment processing error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Add this new endpoint to handle payment confirmation
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentId } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ error: "Payment not found" });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(payment.stripeSessionId);

    if (paymentIntent.status === "succeeded") {
      payment.status = "completed";
      await payment.save();
      
      // Here you would typically create a subscription
      // await createSubscription(payment.userId, payment.planType);
      
      return res.json({ success: true, payment });
    }

    res.status(400).json({ error: "Payment not completed" });
  } catch (error) {
    console.error("Payment confirmation error:", error);
    res.status(500).json({ error: error.message });
  }
};

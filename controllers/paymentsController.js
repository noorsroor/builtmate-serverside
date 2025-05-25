const Stripe = require("stripe");
const paypal = require("paypal-rest-sdk");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

paypal.configure({
  mode: "sandbox", // change to "live" in production
  client_id: process.env.CLIENT_ID_PAYPAL,
  client_secret: process.env.SECRET_PAYPAL,
});

// Stripe Payment Intent
exports.createStripePayment = async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe uses cents
      currency: "usd",
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("Stripe Payment Error:", error);
    res.status(500).json({ error: "Stripe Payment Failed" });
  }
};

// PayPal Payment Create
exports.createPaypalPayment = (req, res) => {
  const { amount } = req.body;
  const create_payment_json = {
    intent: "sale",
    payer: { payment_method: "paypal" },
    redirect_urls: {
      return_url: "http://localhost:5173/payment-success", // your frontend route
      cancel_url: "http://localhost:5173/payment-cancel",
    },
    transactions: [
      {
        amount: { currency: "USD", total: amount.toFixed(2) },
        description: "Builtmate Booking Payment",
      },
    ],
  };

  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      console.error("Paypal Payment Error:", error);
      res.status(500).json({ error: "Paypal Payment Failed" });
    } else {
      const approvalUrl = payment.links.find((link) => link.rel === "approval_url");
      res.json({ approvalUrl: approvalUrl.href });
    }
  });
};

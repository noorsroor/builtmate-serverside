const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const professionalRoutes = require("./routes/professionalRoutes");
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const uploadRoute = require('./routes/uploadRoute');
const projectRoutes = require('./routes/projectRoutes')
const reviewRoutes = require("./routes/reviewRoutes")
const userRoutes = require("./routes/userRoutes")
const bookingRoutes = require("./routes/bookingRoutes");
const payment = require("./routes/payment");
const adminRoutes = require("./routes/adminRoutes")
const adminUsersRoutes = require("./routes/adminUserRoutes")
const adminProfessionalRoutes = require ("./routes/adminProRoutes");
const contactRoutes =require( "./routes/contactRoutes.js");
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true })); // Enable CORS for frontend
app.use(cookieParser()); // Handle cookies
app.use(morgan('dev')); // Log requests
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses

// // Rate Limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests
//   message: "Too many requests, please try again later.",
// });
// app.use(limiter);

// // Routes (Example)
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/professionals", professionalRoutes);
app.use('/api/bookmarks', bookmarkRoutes );
app.use('/api', uploadRoute);
app.use('/api', projectRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", payment);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/users", adminUsersRoutes);
app.use('/api/admin/professionals', adminProfessionalRoutes);
app.use("/api", contactRoutes);
// Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

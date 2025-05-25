const Booking = require("../models/BookingModel");
const nodemailer = require("nodemailer");
const Professional = require('../models/Professional');
const sendEmail = require("../utils/sendEmail");
const User = require('../models/userModel'); // Make sure this is imported
const cloudinary = require("../utils/cloudinary");

// 1.🟥 User creates booking (quote request)
exports.createBooking = async (req, res) => {
  try {
    const { user, professional, type, formData } = req.body;

    const processedFormData = { ...formData };

    // Check for image fields and upload them to Cloudinary
    for (const key in processedFormData) {
      const value = processedFormData[key];

      // If it's a base64 image string
      if (typeof value === 'string' && value.startsWith('data:image')) {
        const uploadResult = await cloudinary.uploader.upload(value, {
          folder: "builtmate/bookings",
        });
        processedFormData[key] = uploadResult.secure_url;
      }
    }

    // Create booking
    const newBooking = await Booking.create({
      user,
      professional,
      type,
      formData: processedFormData,
    });

    // Find professional
    const pro = await Professional.findById(professional);
    if (!pro) return res.status(404).json({ error: "Professional not found" });

    // Find user account of professional
    const proUser = await User.findById(pro.userId);
    if (!proUser) return res.status(404).json({ error: "Professional's user not found" });

    // Send email to professional
    await sendEmail({
      to: proUser.email,
      subject: "New Booking Request Received",
      html: `
        <h3>Hello ${proUser.firstname || "Professional"},</h3>
        <p>You just received a new booking request for <strong>${type}</strong>.</p>
        <h4>Client Requirements:</h4>
       <ul>
            ${Object.entries(formData).map(
              ([key, value]) =>` <li><strong>${key}:</strong> ${value}</li>`
            ).join('')}
          </ul>
        <p>Log in to your dashboard to respond with a quote.</p>
        <p><a href="http://localhost:5173/profile">View Bookings</a></p>
        <br/>
        <p>— The Builtmate Team</p>
      `,
    });

    res.status(201).json({ message: "Booking request sent", booking: newBooking });

  } catch (error) {
    console.error("Create Booking Error:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

// 2.🟥 Get bookings made by a user
exports.getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .populate({
        path: "professional",
        populate: {
          path: "userId",
          select: "firstname lastname email"
        }
      });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user bookings" });
  }
};

// 3.🟥 Get booking requests received by a Pro
exports.getBookingsByPro = async (req, res) => {
  try {
    const bookings = await Booking.find({ professional: req.params.proId }).populate('user', 'firstname lastname email')
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pro bookings" });
  }
};

// 4.🟥 Get a single booking (for modal view or details)
exports.getSingleBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("user professional");
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch booking" });
  }
};

// 5.🟥 Pro responds with quote price
exports.submitQuote = async (req, res) => {
    try {
        const { bookingId } = req.params;
        const { quotePrice } = req.body;
    
        // ✅ Populate the 'user' field to get email and name
        const booking = await Booking.findById(bookingId).populate("user");
    
        if (!booking) return res.status(404).json({ error: "Booking not found" });
    
        booking.quotePrice = quotePrice;
        booking.status = "quoted";
        await booking.save();
    
        // ✅ Make sure user data is available
        const userEmail = booking.user?.email;
        const userName = booking.user?.firstname || "there";
    
        if (userEmail) {
          await sendEmail({
            to: userEmail,
            subject: "You received a quote!",
            html: `
              <h3>Hello ${userName},</h3>
              <p>Your booking request has been quoted at <strong>$${quotePrice}</strong>.</p>
              <p><a href="http://localhost:5173/user/bookings">View Booking</a></p>
              <br/>
              <p>— The Builtmate Team</p>
            `,
          });
        }
    
        res.status(200).json({ message: "Quote submitted", booking });
      } catch (error) {
        console.error("Submit quote error:", error);
        res.status(500).json({ error: "Failed to submit quote" });
      }
    };

// 6.🟥 User pays the quoted price
exports.payForBooking = async (req, res) => {
    try {
      const { method, transactionId } = req.body;
      const { bookingId } = req.params;
  
      const booking = await Booking.findById(bookingId).populate('user');
      if (!booking) return res.status(404).json({ error: "Booking not found" });
  
      // Calculate admin commission (10%)
      const adminCommission = booking.quotePrice * 0.1;
      const amountPaid = booking.quotePrice;
  
      booking.status = "paid";
      booking.isPaid = true;
      booking.payment = {
        amountPaid,
        adminCommission,
        paymentDate: new Date(),
        method,
        transactionId
      };
  
      await booking.save();
  
      // Find professional and their account
      const pro = await Professional.findById(booking.professional);
      const proUser = await User.findById(pro.userId);
  
      if (proUser) {
        await sendEmail({
          to: proUser.email,
          subject: "Booking Payment Received",
          html: `
            <h3>Hello ${proUser.firstname || 'Professional'},</h3>
            <p>Your booking request has been paid!</p>
            <p><strong>Amount:</strong> $${amountPaid}</p>
            <p><strong>Client:</strong> ${booking.user.firstname} ${booking.user.lastname}</p>
            <p>You can now begin the service as per agreement.</p>
            <p><a href="http://localhost:5173/pro/profile">View Booking</a></p>
            <br/>
            <p>— The Builtmate Team</p>
          `
        });
      }
  
      res.status(200).json({ message: "Payment successful", booking });
  
    } catch (err) {
      console.error("Payment Error:", err);
      res.status(500).json({ error: "Payment failed" });
    }
  };




// controllers/contactController.js
const nodemailer =require("nodemailer");
const ContactMessage =require ("../models/ContactMessage");

exports.sendContactMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Save message to DB (optional)
    await ContactMessage.create({ name, email, subject, message });

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your gmail
        pass: process.env.EMAIL_PASS, // app password (not your Gmail password)
      },
    });

    const mailOptions = {
      from: email,
      to: "justplantt@gmail.com",
      subject: `Contact Form: ${subject}`,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending contact message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// const mongoose = require("mongoose");

// const ProfessionalSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
//     profession: { type: String, required: true },
//     bio: { type: String, default: "" },
//     portfolio: [String], // Array of portfolio images or project links
//     experience: { type: Number, required: true }, // Years of experience
//     certifications: [String], // List of certifications (if any)
//     backgroundImage: { type: String, default: "" }, // Will appear on "Find Pro" page
//     location: { type: String, required: true },
//     isOrganization: {type: String, enum: ["individual", "organization"], required: true, default: "individual"},
//     pricePerHour: { type: Number, required: true },
//     projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
//     reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
//     messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
//     appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
//     transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
//     subscriptionExpires: { type: Date },
//     status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },

//     // ⭐️ Rating system
//     rating: {
//       average: { type: Number, default: 0 }, // Average rating (calculated)
//       totalReviews: { type: Number, default: 0 } // Number of reviews received
//     },
//     // 💳 Payout Info for Receiving Payments
//     paymentInfo: {
//       method: { type: String, enum: ["paypal", "stripe"], default: "stripe" },
//       payoutEmail: { type: String },
//       stripeAccountId: { type: String },
//       country: { type: String }
//     }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("Professional", ProfessionalSchema);


const mongoose = require("mongoose");

const ProfessionalSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    
    // Type: individual | organization | all_in_one
    professionalType: { 
      type: String, 
      enum: ["individual", "organization", "all_in_one"], 
      required: true 
    },

    // Common Fields
    profession: { type: String }, // Optional depending on type
    bio: { type: String, default: "" },
    portfolio: [String],
    experience: { type: Number },
    certifications: [String],
    backgroundImage: { type: String, default: "" },
    location: { type: String, required: true },
    pricePerHour: { type: Number }, // Only for individuals

    // For "organization"
    companyServices: { type: String },
    companyRegistration: { type: String }, // Cloudinary file URL

    // For "all_in_one"
    packageType: {
      type: String,
      enum: ["Full Construction Package", "Pre-fabricated Home", "Full Construction & Pre-fabricated Home"],
    },
    packagePriceEstimate: { type: Number },
    packageServices: { type: String },

    // Relationships
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }],
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
    appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }],
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],

    // Subscription
    subscriptionExpires: { type: Date },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },

    rating: {
      average: { type: Number, default: 0 },
      totalReviews: { type: Number, default: 0 }
    },

    // Payment Info
    paymentInfo: {
      method: { type: String, enum: ["paypal", "stripe"], default: "stripe" },
      payoutEmail: { type: String },
      stripeAccountId: { type: String },
      country: { type: String }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Professional", ProfessionalSchema);


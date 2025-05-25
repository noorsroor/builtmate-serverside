const User = require("../models/UserModel");
const Bookmark = require("../models/Bookmark");
const Professional = require("../models/Professional");
const Project = require("../models/ProjectModel");
const cloudinary = require("../utils/cloudinary");

//🟥 get user data 
exports.getUserInfo = async (req, res) => {
  try {
    // Find the user without password
    const user = await User.findById(req.params.id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create response object
    const responseData = { user };

    // Check if the user has a professional profile
    if (user.professionalId) {
      // Fetch only the specified professional data fields
      const professionalData = await Professional.findOne({ userId: user._id })
        .select("backgroundImage bio location paymentInfo");
      
      if (professionalData) {
        // Add professional data to response
        responseData.professionalData = professionalData;
      }
    }

    res.status(200).json(responseData);
  } catch (err) {
    console.error("Error fetching user info:", err);
    res.status(500).json({ message: "User fetch failed", error: err.message });
  }
};
  
//🟥 update user info
exports.updateUserInfo = async (req, res) => {
  try {
    // Extract user data from request body
    const { firstname, lastname, phone, address } = req.body;
    
    // Extract professional data from request body if available
    const { bio, location } = req.body;
    const paymentInfo = req.body.paymentInfo ? JSON.parse(req.body.paymentInfo) : null;
    
    // Handle file uploads
    let profilePicture;
    let backgroundImageUrl;

    // Handle profile image upload if present
    if (req.files && req.files.profileImage) {
      const result = await cloudinary.uploader.upload(req.files.profileImage[0].path);
      profilePicture = result.secure_url;
    } else if (req.file) { // For backward compatibility
      const result = await cloudinary.uploader.upload(req.file.path);
      profilePicture = result.secure_url;
    }

    // Handle background image upload if present
    if (req.files && req.files.backgroundImage) {
      const result = await cloudinary.uploader.upload(req.files.backgroundImage[0].path);
      backgroundImageUrl = result.secure_url;
    }
 
    // Prepare user update data
    const userUpdateData = { firstname, lastname, phone, address };
    if (profilePicture) userUpdateData.profilePicture = profilePicture;
 
    // Update user information
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      userUpdateData, 
      { new: true }
    ).select("-password");
    
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Create response object
    const responseData = { user: updatedUser };
    
    // Check if user has professional profile, and update if data is provided
    if (updatedUser.professionalId) {
      // Prepare professional update data (only include fields that were provided)
      const proUpdateData = {};
      if (bio !== undefined) proUpdateData.bio = bio;
      if (location !== undefined) proUpdateData.location = location;
      if (backgroundImageUrl) proUpdateData.backgroundImage = backgroundImageUrl;
      
      // Handle payment info update if provided
      if (paymentInfo) {
        // Validate payment info fields
        const validPaymentFields = {};
        if (paymentInfo.method) validPaymentFields.method = paymentInfo.method;
        if (paymentInfo.payoutEmail) validPaymentFields.payoutEmail = paymentInfo.payoutEmail;
        if (paymentInfo.stripeAccountId) validPaymentFields.stripeAccountId = paymentInfo.stripeAccountId;
        if (paymentInfo.country) validPaymentFields.country = paymentInfo.country;
        
        // Only update payment info if valid fields were provided
        if (Object.keys(validPaymentFields).length > 0) {
          proUpdateData.paymentInfo = validPaymentFields;
        }
      }
      
      // Only update professional profile if there's data to update
      if (Object.keys(proUpdateData).length > 0) {
        const updatedPro = await Professional.findOneAndUpdate(
          { userId: updatedUser._id },
          { $set: proUpdateData },
          { new: true }
        ).select("bio location paymentInfo backgroundImage");
        
        if (updatedPro) {
          responseData.professionalData = updatedPro;
        }
      } else {
        // If no pro data was updated but user has proId, fetch the current pro data
        const professionalData = await Professional.findOne({ userId: updatedUser._id })
          .select("bio location paymentInfo backgroundImage");
        
        if (professionalData) {
          responseData.professionalData = professionalData;
        }
      }
    }
 
    return res.status(200).json(responseData);
 
  } catch (err) {
    console.error("Update failed:", err);
    return res.status(500).json({ message: "Update failed", error: err.message });
  }
};
  
//🟥 get all users bookmarks
  exports.getUserBookmarks = async (req, res) => {
    try {
      const bookmark = await Bookmark.findOne({ user: req.params.id })
        .populate("professionals")
        .populate({ path: "projects",
          match: { status: "approved" }});
      res.status(200).json(bookmark);
    } catch (err) {
      res.status(500).json({ message: "Bookmarks fetch failed", error: err });
    }
  };
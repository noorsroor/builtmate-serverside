const Review = require("../models/ReviewModel");
const Professional = require("../models/Professional");

// 🟥desc Create a review
const addReview = async (req, res) => {
  try {
    const { userId, professionalId, rating, comment } = req.body;

    // 1. Create the review
    const newReview = await Review.create({
      userId,
      professionalId,
      rating,
      comment,
    });

    // 2. Push review to professional's review array
    await Professional.findByIdAndUpdate(professionalId, {
      $push: { reviews: newReview._id },
    });

    // 3. Find all reviews for that professional
    const reviews = await Review.find({ professionalId });

    // 4. Calculate new average and total
    const totalReviews = reviews.length;
    const average = reviews.reduce((acc, review) => acc + review.rating, 0) / totalReviews;

    // 5. Update Professional model
    await Professional.findByIdAndUpdate(professionalId, {
      rating: {
        average: average.toFixed(1),
        totalReviews,
      },
    });

    res.status(201).json({ message: "Review submitted", review: newReview });
  } catch (error) {
    console.error("Review Error:", error);
    res.status(500).json({ error: "Failed to submit review" });
  }
};

module.exports = { addReview };
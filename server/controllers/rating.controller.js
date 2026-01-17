import Rating from "../models/rating.model.js";

export const createOrUpdateRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const userId = req.user._id;
    const userName = req.user.fullname;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    if (!userName) {
      return res.status(400).json({ message: "User name missing" });
    }

    const existingRating = await Rating.findOne({ userId });

    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();

      return res.status(200).json({
        message: "Rating updated successfully",
        rating: existingRating,
      });
    }

    const newRating = await Rating.create({
      userId,
      userName,
      rating,
    });

    return res.status(201).json({
      message: "Rating created successfully",
      rating: newRating,
    });
  } catch (error) {
    console.error("Error creating/updating rating:", error);
    res.status(500).json({ message: "Failed to submit rating" });
  }
};

export const getAverageRating = async (req, res) => {
  try {
    const ratings = await Rating.find();

    if (!ratings.length) {
      return res.status(200).json({ average: 0, count: 0 });
    }

    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    const average = sum / ratings.length;

    res.status(200).json({
      average: Number(average.toFixed(1)),
      count: ratings.length,
    });
  } catch (error) {
    console.error("Error getting average rating:", error);
    res.status(500).json({ message: "Failed to get rating" });
  }
};

export const getUserRating = async (req, res) => {
  try {
    const userId = req.user._id;
    const rating = await Rating.findOne({ userId });

    res.status(200).json({
      rating: rating ? rating.rating : null,
    });
  } catch (error) {
    console.error("Error getting user rating:", error);
    res.status(500).json({ message: "Failed to get user rating" });
  }
};

export const getAllRatings = async (req, res) => {
  try {
    const ratings = await Rating.find()
      .sort({ createdAt: -1 })
      .limit(50);
    
    res.status(200).json({ ratings });
  } catch (error) {
    console.error("Error getting all ratings:", error);
    res.status(500).json({ message: "Failed to get ratings" });
  }
};
import Rating from "../models/rating.model.js";

export const createOrUpdateRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const userId = req.user._id;
    const userName = req.user.username;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const existingRating = await Rating.findOne({ userId });

    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
      return res.status(200).json({ 
        message: "Rating updated successfully",
        rating: existingRating 
      });
    } else {
      const newRating = new Rating({
        userId,
        userName,
        rating,
      });
      await newRating.save();
      return res.status(201).json({ 
        message: "Rating created successfully",
        rating: newRating 
      });
    }
  } catch (error) {
    console.error("Error creating/updating rating:", error);
    res.status(500).json({ message: "Failed to submit rating" });
  }
};

export const getAverageRating = async (req, res) => {
  try {
    const ratings = await Rating.find();
    
    if (ratings.length === 0) {
      return res.status(200).json({ 
        average: 0, 
        count: 0 
      });
    }

    const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    const average = sum / ratings.length;

    res.status(200).json({ 
      average: parseFloat(average.toFixed(1)), 
      count: ratings.length 
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
    
    if (!rating) {
      return res.status(200).json({ rating: null });
    }

    res.status(200).json({ rating: rating.rating });
  } catch (error) {
    console.error("Error getting user rating:", error);
    res.status(500).json({ message: "Failed to get user rating" });
  }
};
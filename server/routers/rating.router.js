import express from "express";
import { 
  createOrUpdateRating, 
  getAverageRating, 
  getUserRating, 
  getAllRatings 
} from "../controllers/rating.controller.js";
import protect from "../middlewares/auth.middleware.js";
import { adminRoute } from "../middlewares/admin.middleware.js";

const RatingRouter = express.Router();

RatingRouter.get("/average", getAverageRating);

RatingRouter.post("/", protect, createOrUpdateRating);
RatingRouter.get("/user", protect, getUserRating);
RatingRouter.get("/all", protect, adminRoute, getAllRatings);

export default RatingRouter;
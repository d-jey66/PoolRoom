import express from "express";
import { 
  createOrUpdateRating, 
  getAverageRating, 
  getUserRating 
} from "../controllers/rating.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const RatingRouter = express.Router();

RatingRouter.get("/average", getAverageRating);

RatingRouter.post("/", protect, createOrUpdateRating);
RatingRouter.get("/user", protect, getUserRating);

export default RatingRouter;
import express from "express";
import { 
  createOrUpdateRating, 
  getAverageRating, 
  getUserRating 
} from "../controllers/rating.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const RatingRouter = express.Router();

RatingRouter.get("/average", getAverageRating);

RatingRouter.post("/", protectRoute, createOrUpdateRating);
RatingRouter.get("/user", protectRoute, getUserRating);

export default RatingRouter;
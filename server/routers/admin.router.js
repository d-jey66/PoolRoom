import express from "express";
import {
  getDashboardStats,
  getAllUsers,
  promoteToAdmin,
  demoteToUser,
  deleteUser
} from "../controllers/admin.controller.js";
import { adminRoute } from "../middlewares/auth.middleware.js";
import protect from "../middlewares/auth.middleware.js";

const AdminRouter = express.Router();

AdminRouter.use(protect, adminRoute);

AdminRouter.get("/stats", getDashboardStats);

AdminRouter.get("/users", getAllUsers);
AdminRouter.put("/users/:userId/promote", promoteToAdmin);
AdminRouter.put("/users/:userId/demote", demoteToUser);
AdminRouter.delete("/users/:userId", deleteUser);

export default AdminRouter;
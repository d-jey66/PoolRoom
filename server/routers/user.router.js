import express from 'express';
import protect from '../middlewares/auth.middleware.js';
import { updateProfile, changePassword, getProfile, deleteAccount } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.use(protect);

userRouter.get('/profile', getProfile);
userRouter.put('/update-profile', updateProfile);
userRouter.put('/change-password', changePassword);
userRouter.delete('/delete-account', deleteAccount);

export default userRouter;
import express from 'express';
import { signup, login, logout, verify, autoLogin } from '../controllers/auth.controller.js';
import protect from '../middlewares/auth.middleware.js';
  
const authRouter = express.Router();
  
authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.post('/auto-login', protect,  autoLogin)
  
authRouter.get('/verify/:code', verify);
  
export default authRouter;

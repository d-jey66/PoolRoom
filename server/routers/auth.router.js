  import express from 'express';
  import { signup, login, logout, verify } from '../controllers/auth.controller.js';
  import protect from '../middlewares/auth.middleware.js';
  
  const authRouter = express.Router();
  
  authRouter.post('/signup', signup);
  authRouter.post('/login', login);
  authRouter.post('/logout', logout);
  
  authRouter.get('/verify/:code', verify);
  
  authRouter.post('/auto-login', protect, async (req, res, next) => {
      res.status(200).json(req.user);
  });
  
  export default authRouter;

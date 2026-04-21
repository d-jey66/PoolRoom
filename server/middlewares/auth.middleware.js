import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import User from '../models/user.model.js';
import catchAsync from '../utils/catchAsync.js';

const protect = catchAsync(async (req, res, next) => {
    let token;

    if (req.cookies && req.cookies.lg) {
        token = req.cookies.lg;
    }
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
        return next(new AppError('You are not logged in! Please log in.', 401));
    }
  
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in DB
    const user = await User.findById(decoded.id);
    if (!user) {
        return next(new AppError('The user belonging to this token does no longer exist.', 401));
    }

    req.user = user;
    next();
});

export const adminRoute = catchAsync(async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
});

export default protect;
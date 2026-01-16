import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import User from '../models/user.model.js';
import catchAsync from '../utils/catchAsync.js';

const protect = catchAsync(async (req, res, next) => {
    const token = req.cookies.lg;
    if (!token) {
        return next(new AppError('You are not logged in! Please log in.', 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
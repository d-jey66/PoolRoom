import User from '../models/user.model.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// update user profile
export const updateProfile = catchAsync(async (req, res, next) => {
    const { fullname, email } = req.body;
    
    if (!fullname || !email) {
        return next(new AppError('Please provide fullname and email', 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
        return next(new AppError('Email already in use', 409));
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { fullname, email },
        { new: true, runValidators: true }
    );

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        status: 'success',
        user,
        message: 'success'
    });
});

// update user password
export const changePassword = catchAsync(async (req, res, next) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return next(new AppError('Please provide current and new password', 400));
    }

    if (newPassword.length < 6 || newPassword.length > 12) {
        return next(new AppError('Password must be between 6 and 12 characters', 400));
    }

    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    const isCorrect = await user.comparePassword(currentPassword);
    if (!isCorrect) {
        return next(new AppError('Current password is incorrect', 401));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
        status: 'success',
        message: 'Password changed successfully'
    });
});

// get users profile
export const getProfile = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    
    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.status(200).json({
        status: 'success',
        user
    });
});

// delete profile
export const deleteAccount = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        { isActive: false },
        { new: true }
    );

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    res.clearCookie('lg');
    res.status(200).json({
        status: 'success',
        message: 'Account deactivated successfully'
    });
});
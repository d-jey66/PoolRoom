import AppError from '../utils/appError.js';

const allowedTo = (...roles) => {
    return (req, _, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError("You don't have permission!", 401));
        }
        next();
    };
};

export default allowedTo;

import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Fullname is required'],
        lowercase: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: [function() { return !this.oauthid }, 'Password is required'],
        minlength: 6,
        maxlength: 12,
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'moderator', 'admin'],
        default: 'user'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    verificationCode: String,
    isVerified: {
        type: Boolean,
        default: false
    },
    oauthid: String,
    oauthProvider: {
        type: String,
        enum: ['google', 'facebook', 'github', null],
        default: null
    },
    avatar: String
}, { timestamps: true });

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function(candidate) {
    return await bcrypt.compare(candidate, this.password);
};

userSchema.methods.createEmailVerificationToken = function() {
    const code = crypto.randomBytes(12).toString('hex'); 
    this.verificationCode = code;
    return code;
}

userSchema.methods.signToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const User = mongoose.model('User', userSchema);

export default User;

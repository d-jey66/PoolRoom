import User from '../models/user.model.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import sendEmail from '../utils/email.js';

const createSendToken = (user, res, redirect = false) => {
    const token = user.signToken();

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    };

    user.password = undefined;

    res.cookie('lg', token, cookieOptions);

    if (redirect) {
        return res.redirect(`${process.env.CLIENT_URL}/panel`);
    }

    console.log(token);

  
    return res.status(200).json({
      status: 'success',
      token,
        user
    });
};

// Signup
const signup = catchAsync(async (req, res, next) => {
    const { email, fullname, password } = req.body;
    const newUser = await User.create({ email, fullname, password });
    const code = newUser.createEmailVerificationToken();
    await newUser.save({ validateBeforeSave: false });
    const verificationUrl = `${req.protocol}://${req.get("host")}/api/auth/verify/${code}`;
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 40px 30px; 
              text-align: center; 
              border-radius: 10px 10px 0 0; 
            }
            .header h1 { margin: 0; font-size: 28px; }
            .content { 
              background: #f9f9f9; 
              padding: 40px 30px; 
              border-radius: 0 0 10px 10px; 
            }
            .welcome-text { 
              font-size: 18px; 
              color: #333; 
              margin-bottom: 20px; 
            }
            .verify-button { 
              display: inline-block; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              text-decoration: none; 
              padding: 15px 40px; 
              border-radius: 8px; 
              font-weight: bold; 
              font-size: 16px; 
              margin: 20px 0; 
              box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
            }
            .verify-button:hover { 
              box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6); 
              color: white;
            }
            .info-box { 
              background: white; 
              padding: 20px; 
              border-radius: 8px; 
              margin: 20px 0; 
              border-left: 4px solid #667eea; 
            }
            .warning-box { 
              background: #fff3cd; 
              padding: 15px; 
              border-radius: 8px; 
              border-left: 4px solid #ffc107; 
              margin: 20px 0; 
            }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              color: #666; 
              font-size: 14px; 
            }
            .footer-note { 
              font-size: 12px; 
              color: #999; 
              margin-top: 15px; 
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎱 Welcome to Pool Room!</h1>
            </div>
            <div class="content">
              <p class="welcome-text">Hi <strong>${fullname}</strong>,</p>
              <p class="welcome-text">
                Thanks for signing up! We're excited to have you join our community. 
                To get started, please verify your email address.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" class="verify-button">
                  ✓ Verify Email Address
                </a>
              </div>

              <div class="info-box">
                <p style="margin: 0;"><strong>What happens next?</strong></p>
                <p style="margin: 10px 0 0 0;">
                  After verifying your email, you'll be able to:
                </p>
                <ul style="margin: 10px 0 0 20px;">
                  <li>Book tables at Pool Room</li>
                  <li>Manage your reservations</li>
                  <li>Get exclusive updates and offers</li>
                </ul>
              </div>

              <div class="warning-box">
                <strong>⏰ Important:</strong> This verification link expires in 24 hours. 
                If you didn't create this account, you can safely ignore this email.
              </div>

              <div class="footer">
                <p>See you at Pool Room! 🎱</p>
                <p class="footer-note">
                  If the button doesn't work, copy and paste this link into your browser:<br>
                  <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
                </p>
                <p class="footer-note">This is an automated email, please do not reply.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
    `;
  
    console.log('VERIFY EMAIL: about to send email to', newUser.email);
    
    try {
        await sendEmail({
            to: newUser.email,
            subject: '🎱 Verify Your Email - Pool Room',
            html
        });
      
      createSendToken(newUser, res);
      
        res.status(201).json({
            status: 'success',
            message: 'User created! Check your email to verify your account.'
        });
      
    } catch (error) {
        newUser.verificationCode = undefined;
        await newUser.save({ validateBeforeSave: false });
        return next(new AppError('Error sending verification email. Try again later.', 500));
    }
});

// verify email and login
const verify = catchAsync(async (req, res, next) => {
    const { code } = req.params;
    const user = await User.findOne({ verificationCode: code });

    if (!user) return next(new AppError('Invalid or expired verification code', 400));

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save({ validateBeforeSave: false });

    // login and go to panel
    createSendToken(user, res, true);
});

// login
const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
        return next(new AppError('Invalid email or password', 401));
    }

    if (!user.isVerified) {
        return next(new AppError('Please verify your email before logging in.', 401));
    }

    createSendToken(user, res);
});

// logout
const logout = catchAsync(async (req, res) => {
    res.clearCookie('lg', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/'
    });
    res.status(200).json({ status: 'success' });
});

const autoLogin = (req, res) => { 
  try {
    res.status(200).json({ user: req.user})
  } catch (error) {
    console.log(error.message)
    res.status(500).json({message: "internal server error"})
  }
}

export { signup, verify, login, logout, autoLogin };


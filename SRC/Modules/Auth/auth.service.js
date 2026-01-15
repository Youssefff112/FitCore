// src/Modules/Auth/auth.service.js
import { User } from '../User/user.model.js';
import { AppError } from '../../Utils/appError.utils.js';
import { sendWelcomeEmail, sendPasswordResetEmail } from '../../Utils/Emails/sendEmail.utils.js';
import jwt from 'jsonwebtoken';

export const authService = {
  async register(userData) {
    const { email, password, confirmPassword, ...rest } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Create user
    const user = await User.create({
      email,
      password,
      ...rest
    });

    // Send welcome email (don't await to avoid blocking)
    sendWelcomeEmail(user).catch(err => console.error('Welcome email error:', err));

    return user;
  },

  async login(email, password) {
    // Find user and include password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new AppError('Your account has been deactivated', 401);
    }

    // Generate tokens
    const token = user.generateToken();
    const refreshToken = user.generateRefreshToken();

    // Save refresh token
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { user, token, refreshToken };
  },

  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
      );

      const user = await User.findById(decoded.userId);
      if (!user || user.refreshToken !== refreshToken || !user.isActive) {
        throw new AppError('Invalid refresh token', 401);
      }

      // Generate new tokens
      const token = user.generateToken();
      const newRefreshToken = user.generateRefreshToken();

      // Save new refresh token
      user.refreshToken = newRefreshToken;
      await user.save({ validateBeforeSave: false });

      return { token, newRefreshToken };
    } catch (error) {
      if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        throw new AppError('Invalid or expired refresh token', 401);
      }
      throw error;
    }
  },

  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if user exists for security
      return;
    }

    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      await sendPasswordResetEmail(user, resetToken);
    } catch (error) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      throw new AppError('Error sending email. Please try again later.', 500);
    }
  },

  async resetPassword(token, password) {
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    const user = await User.findOne({
      _id: decoded.userId,
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() }
    }).select('+password');

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return user;
  },

  async logout(userId) {
    await User.findByIdAndUpdate(userId, {
      refreshToken: undefined
    });
  }
};


// src/Modules/User/user.service.js
import { User } from './user.model.js';
import { AppError } from '../../Utils/appError.utils.js';

export const userService = {
  async getProfile(userId) {
    const user = await User.findById(userId).select('-password -refreshToken -passwordResetToken');
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  },

  async updateProfile(userId, updates) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password -refreshToken -passwordResetToken');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  },

  async completeOnboarding(userId, data) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Validate home equipment for offline users
    if (user.userType === 'offline' && (!data.profile.homeEquipment || data.profile.homeEquipment.length === 0)) {
      throw new AppError('Home equipment is required for offline users', 400);
    }

    // Update profile
    user.profile = {
      ...user.profile,
      ...data.profile
    };

    await user.save();
    const updatedUser = await User.findById(userId).select('-password -refreshToken -passwordResetToken');
    return updatedUser;
  },

  async deleteAccount(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }
};


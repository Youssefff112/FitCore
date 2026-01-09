import { User } from '../User/user.model.js';
import { Gym } from '../Gym/gym.model.js';
import { Exercise } from '../Exercise/exercise.model.js';
import { AppError } from '../../Utils/appError.utils.js';

export const adminService = {
  // Dashboard Statistics (FR-4.1)
  async getDashboardStats() {
    const [totalUsers, totalGyms, totalExercises, newUsers] = await Promise.all([
      User.countDocuments({ isActive: true }),
      Gym.countDocuments({ isActive: true }),
      Exercise.countDocuments({ isActive: true }),
      User.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      })
    ]);

    const usersByType = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$userType', count: { $sum: 1 } } }
    ]);

    return {
      totalUsers,
      totalGyms,
      totalExercises,
      newUsersThisWeek: newUsers,
      usersByType
    };
  },

  // User Management (FR-4.2)
  async getAllUsers(filters) {
    const query = {};
    
    if (filters.userType) query.userType = filters.userType;
    if (filters.isActive !== undefined) query.isActive = filters.isActive === 'true';
    if (filters.search) {
      query.$or = [
        { firstName: { $regex: filters.search, $options: 'i' } },
        { lastName: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } }
      ];
    }

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password -refreshToken -passwordResetToken')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    return {
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  },

  async updateUser(userId, updates) {
    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  },

  async deleteUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.isActive = false;
    await user.save();

    return { message: 'User deactivated successfully' };
  },

  // Gym Management (FR-4.3)
  async createGym(gymData, adminId) {
    const gym = await Gym.create({
      ...gymData,
      addedBy: adminId
    });
    return gym;
  },

  async updateGym(gymId, updates) {
    const gym = await Gym.findByIdAndUpdate(
      gymId,
      updates,
      { new: true, runValidators: true }
    );

    if (!gym) {
      throw new AppError('Gym not found', 404);
    }

    return gym;
  },

  async deleteGym(gymId) {
    const gym = await Gym.findById(gymId);
    if (!gym) {
      throw new AppError('Gym not found', 404);
    }

    gym.isActive = false;
    await gym.save();

    return { message: 'Gym deleted successfully' };
  },

  // Exercise Management (FR-4.4)
  async createExercise(exerciseData, adminId) {
    const exercise = await Exercise.create({
      ...exerciseData,
      createdBy: adminId
    });
    return exercise;
  },

  async updateExercise(exerciseId, updates) {
    const exercise = await Exercise.findByIdAndUpdate(
      exerciseId,
      updates,
      { new: true, runValidators: true }
    );

    if (!exercise) {
      throw new AppError('Exercise not found', 404);
    }

    return exercise;
  },

  async deleteExercise(exerciseId) {
    const exercise = await Exercise.findById(exerciseId);
    if (!exercise) {
      throw new AppError('Exercise not found', 404);
    }

    exercise.isActive = false;
    await exercise.save();

    return { message: 'Exercise deleted successfully' };
  }
};
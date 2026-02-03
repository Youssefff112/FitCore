import { User } from '../User/user.model.js';
import { Gym } from '../Gym/gym.model.js';
import { Exercise } from '../Exercise/exercise.model.js';
import { AppError } from '../../Utils/appError.utils.js';
import { Op, fn, col } from 'sequelize';

export const adminService = {
  // Dashboard Statistics (FR-4.1)
  async getDashboardStats() {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [totalUsers, totalGyms, totalExercises, newUsers, usersByType] = await Promise.all([
      User.count({ where: { isActive: true } }),
      Gym.count({ where: { isActive: true } }),
      Exercise.count({ where: { isActive: true } }),
      User.count({ where: { createdAt: { [Op.gte]: oneWeekAgo } } }),
      User.findAll({
        where: { isActive: true },
        attributes: ['userType', [fn('COUNT', col('id')), 'count']],
        group: ['userType'],
        raw: true
      })
    ]);

    return {
      totalUsers,
      totalGyms,
      totalExercises,
      newUsersThisWeek: newUsers,
      usersByType: usersByType.map(item => ({ _id: item.userType, count: Number(item.count) }))
    };
  },

  // User Management (FR-4.2)
  async getAllUsers(filters) {
    const query = {};
    
    if (filters.userType) query.userType = filters.userType;
    if (filters.isActive !== undefined) query.isActive = filters.isActive === 'true';
    if (filters.search) {
      query[Op.or] = [
        { firstName: { [Op.iLike]: `%${filters.search}%` } },
        { lastName: { [Op.iLike]: `%${filters.search}%` } },
        { email: { [Op.iLike]: `%${filters.search}%` } }
      ];
    }

    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 20;
    const skip = (page - 1) * limit;

    const users = await User.findAll({
      where: query,
      offset: skip,
      limit,
      order: [['createdAt', 'DESC']]
    });

    const total = await User.count({ where: query });

    return {
      users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    };
  },

  async updateUser(userId, updates) {
    await User.update(updates, { where: { id: userId } });
    const user = await User.findByPk(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  },

  async deleteUser(userId) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    user.isActive = false;
    await user.save();

    return { message: 'User deactivated successfully' };
  },

  // Gym Management (FR-4.3)
  async createGym(gymData, adminId) {
    const { location } = gymData;
    let latitude;
    let longitude;

    if (location?.coordinates?.coordinates?.length === 2) {
      [longitude, latitude] = location.coordinates.coordinates;
    } else if (Array.isArray(location?.coordinates) && location.coordinates.length === 2) {
      [longitude, latitude] = location.coordinates;
    }

    const gym = await Gym.create({
      ...gymData,
      addedBy: adminId,
      latitude,
      longitude
    });
    return gym;
  },

  async updateGym(gymId, updates) {
    const { location } = updates;
    let latitude;
    let longitude;

    if (location?.coordinates?.coordinates?.length === 2) {
      [longitude, latitude] = location.coordinates.coordinates;
    } else if (Array.isArray(location?.coordinates) && location.coordinates.length === 2) {
      [longitude, latitude] = location.coordinates;
    }

    if (latitude !== undefined && longitude !== undefined) {
      updates.latitude = latitude;
      updates.longitude = longitude;
    }

    await Gym.update(updates, { where: { id: gymId } });
    const gym = await Gym.findByPk(gymId);

    if (!gym) {
      throw new AppError('Gym not found', 404);
    }

    return gym;
  },

  async deleteGym(gymId) {
    const gym = await Gym.findByPk(gymId);
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
    await Exercise.update(updates, { where: { id: exerciseId } });
    const exercise = await Exercise.findByPk(exerciseId);

    if (!exercise) {
      throw new AppError('Exercise not found', 404);
    }

    return exercise;
  },

  async deleteExercise(exerciseId) {
    const exercise = await Exercise.findByPk(exerciseId);
    if (!exercise) {
      throw new AppError('Exercise not found', 404);
    }

    exercise.isActive = false;
    await exercise.save();

    return { message: 'Exercise deleted successfully' };
  }
};
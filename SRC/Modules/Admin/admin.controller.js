import { adminService } from './admin.service.js';
import { successResponse } from '../../Utils/successResponse.utils.js';

export const adminController = {
  // Dashboard
  async getDashboard(req, res, next) {
    try {
      const stats = await adminService.getDashboardStats();
      successResponse(res, 200, 'Dashboard stats retrieved', { stats });
    } catch (error) {
      next(error);
    }
  },

  // User Management
  async getUsers(req, res, next) {
    try {
      const result = await adminService.getAllUsers(req.query);
      successResponse(res, 200, 'Users retrieved', result.users, result.pagination);
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const user = await adminService.updateUser(req.params.id, req.body);
      successResponse(res, 200, 'User updated successfully', { user });
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const result = await adminService.deleteUser(req.params.id);
      successResponse(res, 200, result.message);
    } catch (error) {
      next(error);
    }
  },

  // Gym Management
  async createGym(req, res, next) {
    try {
      const gym = await adminService.createGym(req.body, req.user._id);
      successResponse(res, 201, 'Gym created successfully', { gym });
    } catch (error) {
      next(error);
    }
  },

  async updateGym(req, res, next) {
    try {
      const gym = await adminService.updateGym(req.params.id, req.body);
      successResponse(res, 200, 'Gym updated successfully', { gym });
    } catch (error) {
      next(error);
    }
  },

  async deleteGym(req, res, next) {
    try {
      const result = await adminService.deleteGym(req.params.id);
      successResponse(res, 200, result.message);
    } catch (error) {
      next(error);
    }
  },

  // Exercise Management
  async createExercise(req, res, next) {
    try {
      const exercise = await adminService.createExercise(req.body, req.user._id);
      successResponse(res, 201, 'Exercise created successfully', { exercise });
    } catch (error) {
      next(error);
    }
  },

  async updateExercise(req, res, next) {
    try {
      const exercise = await adminService.updateExercise(req.params.id, req.body);
      successResponse(res, 200, 'Exercise updated successfully', { exercise });
    } catch (error) {
      next(error);
    }
  },

  async deleteExercise(req, res, next) {
    try {
      const result = await adminService.deleteExercise(req.params.id);
      successResponse(res, 200, result.message);
    } catch (error) {
      next(error);
    }
  }
};
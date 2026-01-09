import { workoutService } from './workout.service.js';
import { successResponse } from '../../Utils/successResponse.utils.js';

export const workoutController = {
  async generatePlan(req, res, next) {
    try {
      const plan = await workoutService.generateWorkoutPlan(req.user._id);
      successResponse(res, 201, 'Workout plan generated successfully', { plan });
    } catch (error) {
      next(error);
    }
  },

  async getActivePlan(req, res, next) {
    try {
      const plan = await workoutService.getActiveWorkoutPlan(req.user._id);
      successResponse(res, 200, 'Active workout plan retrieved', { plan });
    } catch (error) {
      next(error);
    }
  },

  async logWorkout(req, res, next) {
    try {
      const log = await workoutService.logWorkout(req.user._id, req.body);
      successResponse(res, 201, 'Workout logged successfully', { log });
    } catch (error) {
      next(error);
    }
  },

  async getHistory(req, res, next) {
    try {
      const { page, limit } = req.query;
      const result = await workoutService.getWorkoutHistory(
        req.user._id,
        parseInt(page) || 1,
        parseInt(limit) || 10
      );
      successResponse(res, 200, 'Workout history retrieved', result.logs, result.pagination);
    } catch (error) {
      next(error);
    }
  }
};
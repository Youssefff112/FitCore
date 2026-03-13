// src/Modules/Coach/coach.controller.js
import { coachService } from './coach.service.js';
import { successResponse } from '../../Utils/successResponse.utils.js';
import { workoutService } from '../Workout/workout.service.js';
import { dietService } from '../Diet/diet.service.js';
import { User } from '../User/user.model.js';
import { AppError } from '../../Utils/appError.utils.js';

export const coachController = {
  async createCoach(req, res, next) {
    try {
      const coach = await coachService.createCoach(req.body);
      successResponse(res, 201, 'Coach created successfully', { coach });
    } catch (error) {
      next(error);
    }
  },

  async getAllCoaches(req, res, next) {
    try {
      const coaches = await coachService.getAllCoaches();
      successResponse(res, 200, 'Coaches retrieved successfully', { coaches });
    } catch (error) {
      next(error);
    }
  },

  async getCoachById(req, res, next) {
    try {
      const coach = await coachService.getCoachById(req.params.id);
      successResponse(res, 200, 'Coach retrieved successfully', { coach });
    } catch (error) {
      next(error);
    }
  },

  async updateCoach(req, res, next) {
    try {
      const coach = await coachService.updateCoach(req.params.id, req.body);
      successResponse(res, 200, 'Coach updated successfully', { coach });
    } catch (error) {
      next(error);
    }
  },

  async deleteCoach(req, res, next) {
    try {
      const result = await coachService.deleteCoach(req.params.id);
      successResponse(res, 200, result.message);
    } catch (error) {
      next(error);
    }
  },

  async getProfile(req, res, next) {
    try {
      const profile = await coachService.getProfile(req.user.id);
      successResponse(res, 200, 'Coach profile retrieved', { profile });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const profile = await coachService.updateProfile(req.user.id, req.body);
      successResponse(res, 200, 'Coach profile updated', { profile });
    } catch (error) {
      next(error);
    }
  },

  async getClients(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      const result = await coachService.getClients(req.user.id, page, limit);
      successResponse(res, 200, 'Coach clients retrieved', result.clients, result.pagination);
    } catch (error) {
      next(error);
    }
  },

  async getAnalytics(req, res, next) {
    try {
      const analytics = await coachService.getAnalytics(req.user.id);
      successResponse(res, 200, 'Coach analytics retrieved', { analytics });
    } catch (error) {
      next(error);
    }
  },

  async assignWorkoutPlan(req, res, next) {
    try {
      await coachService.requireApprovedCoach(req.user.id);
      const { userId } = req.body;
      if (!userId) {
        throw new AppError('userId is required', 400);
      }

      const client = await User.findByPk(userId);
      if (!client || client.role !== 'client') {
        throw new AppError('Client not found', 404);
      }

      const plan = await workoutService.generateWorkoutPlanForUser(userId, req.user.id);
      successResponse(res, 201, 'Workout plan assigned', { plan });
    } catch (error) {
      next(error);
    }
  },

  async assignDietPlan(req, res, next) {
    try {
      await coachService.requireApprovedCoach(req.user.id);
      const { userId } = req.body;
      if (!userId) {
        throw new AppError('userId is required', 400);
      }

      const client = await User.findByPk(userId);
      if (!client || client.role !== 'client') {
        throw new AppError('Client not found', 404);
      }

      const plan = await dietService.generateDietPlanForUser(userId, req.user.id);
      successResponse(res, 201, 'Diet plan assigned', { plan });
    } catch (error) {
      next(error);
    }
  }
};


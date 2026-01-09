import { dietService } from './diet.service.js';
import { successResponse } from '../../Utils/successResponse.utils.js';

export const dietController = {
  async generatePlan(req, res, next) {
    try {
      const plan = await dietService.generateDietPlan(req.user._id);
      successResponse(res, 201, 'Diet plan generated successfully', { plan });
    } catch (error) {
      next(error);
    }
  },

  async getActivePlan(req, res, next) {
    try {
      const plan = await dietService.getActiveDietPlan(req.user._id);
      successResponse(res, 200, 'Active diet plan retrieved', { plan });
    } catch (error) {
      next(error);
    }
  }
};
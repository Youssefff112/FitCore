// src/Modules/Gym/gym.controller.js
import { gymService } from './gym.service.js';
import { successResponse } from '../../Utils/successResponse.utils.js';

export const gymController = {
  async searchGyms(req, res, next) {
    try {
      const result = await gymService.searchGyms(req.query);
      successResponse(res, 200, 'Gyms retrieved successfully', result.gyms, result.pagination);
    } catch (error) {
      next(error);
    }
  },

  async getGymById(req, res, next) {
    try {
      const gym = await gymService.getGymById(req.params.id);
      successResponse(res, 200, 'Gym retrieved successfully', { gym });
    } catch (error) {
      next(error);
    }
  },

  async getGymsNearby(req, res, next) {
    try {
      const { longitude, latitude, maxDistance } = req.query;
      
      if (!longitude || !latitude) {
        return res.status(400).json({
          success: false,
          message: 'Longitude and latitude are required'
        });
      }

      const gyms = await gymService.getGymsNearby(
        parseFloat(longitude),
        parseFloat(latitude),
        maxDistance ? parseInt(maxDistance) : 5000
      );
      
      successResponse(res, 200, 'Nearby gyms retrieved successfully', { gyms });
    } catch (error) {
      next(error);
    }
  }
};


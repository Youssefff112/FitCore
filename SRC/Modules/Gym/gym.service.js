// src/Modules/Gym/gym.service.js
import { Gym } from './gym.model.js';
import { AppError } from '../../Utils/appError.utils.js';

export const gymService = {
  // Search and filter gyms (FR-2.1, FR-2.2)
  async searchGyms(filters) {
    const query = { isActive: true };

    // Filter by city/area
    if (filters.city) {
      query['location.city'] = filters.city;
    }
    if (filters.area) {
      query['location.area'] = { $regex: filters.area, $options: 'i' };
    }

    // Search by name
    if (filters.name) {
      query.name = { $regex: filters.name, $options: 'i' };
    }

    // Filter by equipment
    if (filters.equipment && filters.equipment.length > 0) {
      query.equipment = { $all: filters.equipment };
    }

    // Filter by open now
    if (filters.openNow === 'true') {
      // This is a simplified check; real implementation would be more complex
      query['operatingHours.is24_7'] = true;
    }

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const gyms = await Gym.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ 'rating.average': -1 });

    const total = await Gym.countDocuments(query);

    return {
      gyms,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  },

  // Get gym details (FR-2.3)
  async getGymById(gymId) {
    const gym = await Gym.findById(gymId);
    if (!gym || !gym.isActive) {
      throw new AppError('Gym not found', 404);
    }

    // Add isOpenNow to response
    const gymObj = gym.toObject();
    gymObj.isOpenNow = gym.isOpenNow();

    return gymObj;
  },

  // Get gyms near location (geospatial search)
  async getGymsNearby(longitude, latitude, maxDistance = 5000) {
    const gyms = await Gym.find({
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: maxDistance // meters
        }
      },
      isActive: true
    }).limit(20);

    return gyms;
  }
};
// src/Modules/Gym/gym.service.js
import { Gym } from './gym.model.js';
import { AppError } from '../../Utils/appError.utils.js';
import { Op, Sequelize } from 'sequelize';
import { sequelize } from '../../../DB/connection.js';

export const gymService = {
  // Search and filter gyms (FR-2.1, FR-2.2)
  async searchGyms(filters) {
    const where = { isActive: true };
    const whereClauses = [];

    // Filter by city/area
    if (filters.city) {
      whereClauses.push(
        Sequelize.where(Sequelize.json('location.city'), filters.city)
      );
    }
    if (filters.area) {
      whereClauses.push(
        Sequelize.where(Sequelize.json('location.area'), { [Op.iLike]: `%${filters.area}%` })
      );
    }

    // Search by name
    if (filters.name) {
      where.name = { [Op.iLike]: `%${filters.name}%` };
    }

    // Filter by equipment
    if (filters.equipment && filters.equipment.length > 0) {
      where.equipment = { [Op.contains]: filters.equipment };
    }

    // Filter by open now
    if (filters.openNow === 'true') {
      whereClauses.push(
        Sequelize.where(Sequelize.json('operatingHours.is24_7'), true)
      );
    }

    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const gyms = await Gym.findAll({
      where: {
        ...where,
        ...(whereClauses.length ? { [Op.and]: whereClauses } : {})
      },
      offset: skip,
      limit,
      order: [[Sequelize.literal("(rating->>'average')::float"), 'DESC']]
    });

    const total = await Gym.count({
      where: {
        ...where,
        ...(whereClauses.length ? { [Op.and]: whereClauses } : {})
      }
    });

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
    const gym = await Gym.findByPk(gymId);
    if (!gym || !gym.isActive) {
      throw new AppError('Gym not found', 404);
    }

    // Add isOpenNow to response
    const gymObj = gym.toJSON();
    gymObj.isOpenNow = gym.isOpenNow();

    return gymObj;
  },

  // Get gyms near location (geospatial search)
  async getGymsNearby(longitude, latitude, maxDistance = 5000) {
    if (Number.isNaN(longitude) || Number.isNaN(latitude)) {
      throw new AppError('Invalid coordinates', 400);
    }

    const distanceLimit = Math.max(0, Number(maxDistance) || 5000);
    const query = `
      SELECT *
      FROM (
        SELECT *,
          (6371000 * acos(
            cos(radians(:lat)) * cos(radians(latitude)) *
            cos(radians(longitude) - radians(:lng)) +
            sin(radians(:lat)) * sin(radians(latitude))
          )) AS distance
        FROM gyms
        WHERE "isActive" = true
          AND latitude IS NOT NULL
          AND longitude IS NOT NULL
      ) AS distance_calc
      WHERE distance <= :maxDistance
      ORDER BY distance ASC
      LIMIT 20
    `;

    const [gyms] = await sequelize.query(query, {
      replacements: { lat: latitude, lng: longitude, maxDistance: distanceLimit }
    });

    return gyms;
  }
};
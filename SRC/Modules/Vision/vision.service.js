// src/Modules/Vision/vision.service.js
import { VisionSession } from './vision.model.js';
import { AppError } from '../../Utils/appError.utils.js';

export const visionService = {
  async startSession(userId, data) {
    const { exerciseName, startedAt } = data;
    if (!exerciseName) {
      throw new AppError('exerciseName is required', 400);
    }

    return VisionSession.create({
      userId,
      exerciseName,
      startedAt: startedAt ? new Date(startedAt) : new Date()
    });
  },

  async updateSession(userId, sessionId, data) {
    const session = await VisionSession.findOne({ where: { id: sessionId, userId } });
    if (!session) {
      throw new AppError('Session not found', 404);
    }

    if (data.repsCount !== undefined) session.repsCount = data.repsCount;
    if (data.accuracyScore !== undefined) session.accuracyScore = data.accuracyScore;
    if (data.feedback !== undefined) session.feedback = data.feedback;
    if (data.rawData !== undefined) session.rawData = data.rawData;
    if (data.endedAt !== undefined) session.endedAt = new Date(data.endedAt);

    await session.save();
    return session;
  },

  async getHistory(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const { rows, count } = await VisionSession.findAndCountAll({
      where: { userId },
      order: [['startedAt', 'DESC']],
      offset,
      limit
    });

    return {
      sessions: rows,
      pagination: {
        page,
        limit,
        total: count,
        pages: Math.ceil(count / limit)
      }
    };
  }
};


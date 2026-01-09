import { Router } from 'express';
import { authenticate, restrictTo } from '../../Middlewares/auth.middleware.js';
import { notificationService } from './notification.service.js';
import { successResponse } from '../../Utils/successResponse.utils.js';

const router = Router();

// Admin endpoint to manually trigger reminders
router.post('/send-reminders', 
  authenticate, 
  restrictTo('admin'), 
  async (req, res, next) => {
    try {
      const result = await notificationService.sendWorkoutReminders();
      successResponse(res, 200, result.message);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
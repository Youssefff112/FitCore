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

// Admin endpoint to schedule a notification
router.post('/schedule',
  authenticate,
  restrictTo('admin'),
  async (req, res, next) => {
    try {
      const notification = await notificationService.scheduleNotification(req.body);
      successResponse(res, 201, 'Notification scheduled', { notification });
    } catch (error) {
      next(error);
    }
  }
);

// User endpoints for in-app notifications
router.get('/',
  authenticate,
  async (req, res, next) => {
    try {
      const notifications = await notificationService.getUserNotifications(req.user.id);
      successResponse(res, 200, 'Notifications retrieved successfully', { notifications });
    } catch (error) {
      next(error);
    }
  }
);

router.patch('/:id/read',
  authenticate,
  async (req, res, next) => {
    try {
      const notification = await notificationService.markAsRead(req.user.id, req.params.id);
      successResponse(res, 200, 'Notification marked as read', { notification });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
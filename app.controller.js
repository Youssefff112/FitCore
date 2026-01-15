// src/app.controller.js
import { Router } from 'express';
import authRoutes from './SRC/Modules/Auth/auth.routes.js';
import userRoutes from './SRC/Modules/User/user.routes.js';
import adminRoutes from './SRC/Modules/Admin/admin.routes.js';
import dietRoutes from './SRC/Modules/Diet/diet.routes.js';
import workoutRoutes from './SRC/Modules/Workout/workout.routes.js';
import gymRoutes from './SRC/Modules/Gym/gym.routes.js';
import notificationRoutes from './SRC/Modules/Notification/notification.routes.js';

const router = Router();

// Mount all route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/diet', dietRoutes);
router.use('/workout', workoutRoutes);
router.use('/gyms', gymRoutes);
router.use('/notifications', notificationRoutes);

export default router;


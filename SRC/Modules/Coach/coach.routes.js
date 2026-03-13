// src/Modules/Coach/coach.routes.js
import { Router } from 'express';
import { coachController } from './coach.controller.js';
import { authenticate, restrictTo } from '../../Middlewares/auth.middleware.js';
import { requireActiveSubscription } from '../../Middlewares/subscription.middleware.js';

const router = Router();

router.use(authenticate, restrictTo('coach'));

router.get('/profile', coachController.getProfile);
router.patch('/profile', coachController.updateProfile);
router.get('/clients', requireActiveSubscription('coach'), coachController.getClients);
router.get('/analytics', requireActiveSubscription('coach'), coachController.getAnalytics);
router.post('/assign/workout', requireActiveSubscription('coach'), coachController.assignWorkoutPlan);
router.post('/assign/diet', requireActiveSubscription('coach'), coachController.assignDietPlan);

export default router;


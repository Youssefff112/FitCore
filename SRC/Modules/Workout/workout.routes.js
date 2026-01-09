import { Router } from 'express';
import { workoutController } from './workout.controller.js';
import { authenticate } from '../../Middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/generate', workoutController.generatePlan);
router.get('/active', workoutController.getActivePlan);
router.post('/log', workoutController.logWorkout);
router.get('/history', workoutController.getHistory);

export default router;
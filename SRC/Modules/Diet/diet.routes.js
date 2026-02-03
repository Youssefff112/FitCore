import { Router } from 'express';
import { dietController } from './diet.controller.js';
import { authenticate } from '../../Middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/generate', dietController.generatePlan);
router.get('/active', dietController.getActivePlan);
router.post('/track', dietController.logDietDay);
router.get('/history', dietController.getHistory);

export default router;
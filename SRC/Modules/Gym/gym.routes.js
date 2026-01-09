// src/Modules/Gym/gym.routes.js
import { Router } from 'express';
import { gymController } from './gym.controller.js';
import { optionalAuth } from '../../Middlewares/auth.middleware.js';

const router = Router();

// Public routes with optional authentication
router.get('/search', optionalAuth, gymController.searchGyms);
router.get('/nearby', optionalAuth, gymController.getGymsNearby);
router.get('/:id', optionalAuth, gymController.getGymById);

export default router;
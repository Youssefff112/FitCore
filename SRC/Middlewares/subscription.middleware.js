// src/Middlewares/subscription.middleware.js
import { subscriptionService } from '../Modules/Subscription/subscription.service.js';

export const requireActiveSubscription = (role) => {
  return async (req, res, next) => {
    try {
      await subscriptionService.requireActiveSubscription(req.user.id, role);
      next();
    } catch (error) {
      next(error);
    }
  };
};


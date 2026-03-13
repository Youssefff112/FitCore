// src/Modules/Chatbot/chatbot.routes.js
import { Router } from 'express';
import { chatbotController } from './chatbot.controller.js';
import { authenticate, restrictTo } from '../../Middlewares/auth.middleware.js';
import { requireActiveSubscription } from '../../Middlewares/subscription.middleware.js';

const router = Router();

router.use(authenticate);

router.post('/messages', restrictTo('client'), requireActiveSubscription('client'), chatbotController.sendMessage);
router.get('/sessions/:sessionId/messages', restrictTo('client'), requireActiveSubscription('client'), chatbotController.getMessages);

router.get('/config', restrictTo('coach'), chatbotController.getConfig);
router.patch('/config', restrictTo('coach'), chatbotController.updateConfig);

export default router;


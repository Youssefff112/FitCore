// src/Modules/Messaging/messaging.routes.js
import { Router } from 'express';
import { protect } from '../Auth/auth.controller.js';
import * as messagingController from './messaging.controller.js';

const router = Router();

// All routes are protected
router.use(protect);

router.get('/', messagingController.getConversations);
router.get('/:conversationId/messages', messagingController.getMessages);
router.post('/:conversationId/messages', messagingController.sendMessage);
router.post('/send', messagingController.sendMessage); // For sending without existing conversation ID

export default router;

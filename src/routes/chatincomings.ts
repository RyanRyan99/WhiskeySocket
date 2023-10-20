import { Router } from 'express';
import { body } from 'express-validator';
import * as controller from '../controllers/chatincoming';
import requestValidator from '../middlewares/request-validator';
import sessionValidator from '../middlewares/session-validator';

const router = Router();
router.get('/', controller.chatincoming);
router.get('/:sessionId/status', requestValidator, controller.chatincoming);

export default router;
import { Router } from "express";
import { authMiddleware } from '../middlewares/auth-middleware';

import { getConversations, createConversation, getChatHistory } from "../controllers/conversation-controller";

const router = Router();

router.use(authMiddleware);

router.get("/", getConversations);
router.get("/:conversationId", getChatHistory);
router.post("/", createConversation);

export default router;
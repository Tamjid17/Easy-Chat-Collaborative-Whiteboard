import { Router } from "express";

import { authMiddleware } from '../middlewares/auth-middleware';
import { sendMessage } from "../controllers/message-controller";

const router = Router();

router.use(authMiddleware);

router.post("/", sendMessage);


export default router;
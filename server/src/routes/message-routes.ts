import { Router } from "express";

import { authMiddleware } from '../middlewares/auth-middleware';
import upload from "../middlewares/multer-middleware";
import { sendMessage } from "../controllers/message-controller";

const router = Router();

router.use(authMiddleware);

router.post("/", upload.single("image"), sendMessage);

export default router;
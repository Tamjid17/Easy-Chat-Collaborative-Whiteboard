import { Router } from "express";
import { authMiddleware } from '../middlewares/auth-middleware';
import { createUser, loginUser, updateName, changePassword } from '../controllers/user-controller';

const router = Router();

router.post('/create', createUser);
router.post('/login', loginUser);
router.put('/update-name', authMiddleware, updateName);
router.put('/change-password', authMiddleware, changePassword);

export default router;
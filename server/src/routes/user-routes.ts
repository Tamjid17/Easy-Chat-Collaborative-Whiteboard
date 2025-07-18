import { Router } from "express";
import { authMiddleware } from '../middlewares/auth-middleware';
import { createUser, loginUser, updateName, changePassword, blockUser, unblockUser, searchUser } from '../controllers/user-controller';

const router = Router();

router.post('/create', createUser);
router.post('/login', loginUser);

router.use(authMiddleware);
router.put('/update-name', updateName);
router.put('/change-password', changePassword);
router.put('/block-user', blockUser);
router.put('/unblock-user', unblockUser);
router.get('/search', searchUser);

export default router;
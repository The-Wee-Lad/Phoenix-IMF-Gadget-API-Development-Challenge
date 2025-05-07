import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();
import {
  register,
  login,
  logout,
  deleteUser,
  update,
  getCurrentUser,
} from '../controllers/user.controller.js';

router
  .route('/')
  .post(register)
  .put(verifyToken, update)
  .get(verifyToken, getCurrentUser)
  .delete(verifyToken, deleteUser);

router.route('/login').post(login);
router.route('/logout').post(verifyToken, logout);

export { router as userRouter };

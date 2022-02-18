import { Router } from 'express';
import { getUser } from '../controller/user.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';

const userRouter = Router();

userRouter.get('/:username', AuthMiddleware, getUser);

export default userRouter;

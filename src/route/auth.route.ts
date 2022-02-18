import { Router } from 'express';
import {
  Login,
  Logout,
  Register,
  UpdateMe,
  UpdatePassword,
  UpdatePublicMovie,
  UpdatePublicStar,
  LoginSocial,
} from '../controller/auth.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { Upload } from '../middleware/image.middleware';
import {
  LoginValidation,
  RegisterValidation,
  UpdateMeValidation,
  UpdatePasswordValidation,
} from '../middleware/validation.middleware';

const authRouter = Router();

authRouter.post('/register', RegisterValidation, Register);
authRouter.post('/login', LoginValidation, Login);
authRouter.post('/login/social', LoginSocial);
authRouter.post('/logout', AuthMiddleware, Logout);
authRouter.put('/update', Upload, UpdateMeValidation, AuthMiddleware, UpdateMe);
authRouter.put('/updatePassword', UpdatePasswordValidation, AuthMiddleware, UpdatePassword);
authRouter.put('/public-movies', AuthMiddleware, UpdatePublicMovie);
authRouter.put('/public-stars', AuthMiddleware, UpdatePublicStar);

export default authRouter;

import { Router } from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware';
import {
  getStarDetail,
  getStars,
  getStarsOfUser,
  saveStar,
  updateStar,
  deleteStar,
} from '../controller/star.controller';
import { Upload } from '../middleware/image.middleware';

const starRouter = Router();
starRouter.get('/homepage', getStars);
starRouter.get('/:username', getStarsOfUser);
starRouter.get('/star-detail/:starId', AuthMiddleware, getStarDetail);
starRouter.post('/', AuthMiddleware, Upload, saveStar);
starRouter.put('/', AuthMiddleware, Upload, updateStar);
starRouter.delete('/:starId', AuthMiddleware, deleteStar);

export default starRouter;

import { Router } from 'express';
import {
  createCommentToMovie,
  createCommentToStar,
  getCommentsOfMovie,
  getCommentsOfStar,
  getCommentsOfMovieCount,
  getCommentsOfStarCount,
} from '../controller/comment.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
const commentRouter = Router();

commentRouter.get('/movie/:movieId', AuthMiddleware, getCommentsOfMovie);
commentRouter.get('/star/:starId', AuthMiddleware, getCommentsOfStar);
// commentRouter.get('/count/movie/:movieId', AuthMiddleware, getCommentsOfMovieCount);
// commentRouter.get('/count/star/:starId', AuthMiddleware, getCommentsOfStarCount);
commentRouter.post('/movie', AuthMiddleware, createCommentToMovie);
commentRouter.post('/star', AuthMiddleware, createCommentToStar);

export default commentRouter;

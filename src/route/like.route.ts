import { Router } from 'express';
import {
  createLikeToMovie,
  createLikeToStar,
  getLikesOfMovieCount,
  getLikesOfStarCount,
  dislikeToStar,
  dislikeToMovie,
} from '../controller/like.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
const likeRouter = Router();

likeRouter.get('/count/movie/:movieId', AuthMiddleware, getLikesOfMovieCount);
likeRouter.get('/count/star/:starId', AuthMiddleware, getLikesOfStarCount);
likeRouter.post('/movie/like', AuthMiddleware, createLikeToMovie);
likeRouter.post('/movie/dislike', AuthMiddleware, dislikeToMovie);
likeRouter.post('/star/like', AuthMiddleware, createLikeToStar);
likeRouter.post('/star/dislike', AuthMiddleware, dislikeToStar);

export default likeRouter;

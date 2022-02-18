import { Router } from 'express';
import { AuthMiddleware } from '../middleware/auth.middleware';
import {
  getMovies,
  saveMovie,
  getMoviesOfAuth,
  getMovie,
  getMovieDetail,
  getMoviesOfUser,
  updateMovie,
  deleteMovie,
} from '../controller/movie.controller';
import { Upload } from '../middleware/image.middleware';

const movieRouter = Router();
movieRouter.get('/homepage', AuthMiddleware, getMovies);
movieRouter.get('/user', AuthMiddleware, getMoviesOfAuth);
movieRouter.get('/:username', AuthMiddleware, getMoviesOfUser); // Kisininkileri getir
movieRouter.get('/movie/:id', AuthMiddleware, getMovie);
movieRouter.get('/movie-detail/:movieId', AuthMiddleware, getMovieDetail);
movieRouter.post('/', AuthMiddleware, Upload, saveMovie);
movieRouter.put('/', AuthMiddleware, Upload, updateMovie);
movieRouter.delete('/:movieId', AuthMiddleware, deleteMovie);

export default movieRouter;

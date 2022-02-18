import { NextFunction, Request, Response } from 'express';
import { getLikesCountByMovieId, isLikeExistOnMovie } from '../service/like.service';
import {
  addMovie,
  deleteMovieById,
  getMoviesPagination,
  getMoviesByUserId,
  getMoviesByUsername,
  getMovieById,
  updateMovieById,
} from '../service/movie.service';
import { areMoviesPublic } from '../service/user.service';
import GlobalError from '../utils/appError';

export const getMovies = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt((req.query.page as string) || '1');
    const take = parseInt((req.query.size as string) || '15');
    const data = await getMoviesPagination(page, take);

    res.status(200).json({
      message: 'success',
      data,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

export const saveMovie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, genre, runTime } = req.body;
    const image = res.locals.image;
    const user = res.locals.user;
    const data = await addMovie(
      {
        name,
        description,
        image,
        genre,
        runTime,
      },
      user
    );

    res.status(201).json({
      message: 'success',
      data,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

export const deleteMovie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteMovieById(req.params.movieId, res.locals.user.id);

    res.status(204).json({
      message: 'success',
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

export const getMoviesOfUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt((req.query.page as string) || '1');
    const take = parseInt((req.query.size as string) || '5');

    const data = await getMoviesByUsername(req.params.username, page, take);

    res.status(200).json({
      message: 'success',
      data,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

export const getMoviesOfAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = res.locals.user.id;
    const data = await getMoviesByUserId(id);

    res.status(200).json({
      message: 'success',
      data,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

export const getMovie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getMovieById(req.query.id as string);

    res.status(200).json({
      message: 'success',
      data,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

export const getMovieDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!(await areMoviesPublic(req.params.movieId))) next(new GlobalError('Page not found', 404));
    // if someone try to reach private Movie,it throws 404

    const movieId = req.params.movieId;
    const userId = res.locals.user.id;
    const movie = await getMovieById(movieId);
    const likeCount = await getLikesCountByMovieId(movieId);
    const userLike = await isLikeExistOnMovie(movieId, userId);

    const data = {
      movie,
      likeCount,
      userLike,
    };

    res.status(200).json({
      message: 'success',
      data,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

export const updateMovie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.user.id;
    if (res.locals.image !== null && res.locals.image !== undefined) {
      req.body.image = res.locals.image;
    }

    await updateMovieById(req.body.id, req.body, userId);
    res.status(200).json({
      message: 'success',
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

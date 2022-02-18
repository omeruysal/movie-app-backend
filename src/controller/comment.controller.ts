import { NextFunction, Request, Response } from 'express';
import { Movie } from '../entity/movie.entity';
import {
  getCommentsByMovieId,
  getCommentsByStarId,
  getCommentsCountByMovieId,
  getCommentsCountByStarId,
  saveCommentToMovie,
  saveCommentToStar,
} from '../service/comment.service';
import GlobalError from '../utils/appError';

export const createCommentToMovie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { description, id } = req.body;
    const userId = res.locals.user.id;
    const data = await saveCommentToMovie(description, id, userId);

    res.status(200).json({
      message: 'success',
      data,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

export const createCommentToStar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { description, id } = req.body;
    const userId = res.locals.user.id;

    const data = await saveCommentToStar(description, id, userId);
    res.status(200).json({
      message: 'success',
      data,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};
export const getCommentsOfMovie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt((req.query.page as string) || '1');
    const take = parseInt((req.query.size as string) || '5');
    const movieId = req.params.movieId;

    const data = await getCommentsByMovieId(movieId, page, take);

    res.status(200).json({
      message: 'success',
      data,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

export const getCommentsOfStar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt((req.query.page as string) || '1');
    const take = parseInt((req.query.size as string) || '5');
    const starId = req.params.starId;
    const data = await getCommentsByStarId(starId, page, take);

    res.status(200).json({
      message: 'success',
      data,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

export const deleteCommentOfMovie = async (req: Request, res: Response) => {
  try {
    //delete

    res.status(204).json({
      message: 'success',
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const deleteCommentOfStar = async (req: Request, res: Response) => {
  try {
    //delete
    res.status(204).json({
      message: 'success',
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const getCommentsOfMovieCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getCommentsCountByMovieId(req.params.movieId);

    res.status(200).json({
      message: 'success',
      data,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

export const getCommentsOfStarCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getCommentsCountByStarId(req.params.starId);

    res.status(200).json({
      message: 'success',
      data,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

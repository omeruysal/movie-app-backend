import { NextFunction, Request, Response } from 'express';
import {
  getLikesCountByMovieId,
  getLikesCountByStarId,
  isLikeExistOnMovie,
  removeLikeToMovie,
  saveLikeToMovie,
  saveLikeToStar,
} from '../service/like.service';
import GlobalError from '../utils/appError';

export const createLikeToMovie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { movieId } = req.body;
    const data = await saveLikeToMovie(movieId, res.locals.user.id);
    res.status(200).json({
      message: 'success',
      data,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

export const createLikeToStar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, starId } = req.body;

    const data = await saveLikeToStar(starId, userId);
    res.status(200).json({
      message: 'success',
      data,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

export const getLikesOfMovieCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getLikesCountByMovieId(req.params.movieId);

    res.status(200).json({
      message: 'success',
      data,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

export const getLikesOfStarCount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getLikesCountByStarId(req.params.starId);

    res.status(200).json({
      message: 'success',
      data,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

export const dislikeToMovie = async (req: Request, res: Response) => {
  try {
    await removeLikeToMovie(req.body.movieId, res.locals.user.id);

    res.status(204).json({
      message: 'success',
    });
  } catch (error) {
    res.status(500).json({
      error,
    });
  }
};

export const dislikeToStar = async (req: Request, res: Response) => {
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

// export const didUserLikeMovie = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     console.log(req.params);

//     const data = await isLikeExistOnMovie(req.params.movieId as string, req.params.userId as string);

//     res.status(200).json({
//       message: 'success',
//       data,
//     });
//   } catch (error: any) {
//     next(new GlobalError(error.message));
//   }
// };

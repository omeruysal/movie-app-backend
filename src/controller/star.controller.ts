import { NextFunction, Request, Response } from 'express';
import { getLikesCountByStarId, isLikeExistOnStar } from '../service/like.service';
import {
  addStar,
  deleteStarById,
  getAllStars,
  getStarById,
  getStarsByUserId,
  getStarsByUsername,
  updateStarById,
} from '../service/star.service';
import { areStarsPublic } from '../service/user.service';
import GlobalError from '../utils/appError';

export const getStars = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt((req.query.page as string) || '1');
    const take = parseInt((req.query.size as string) || '5');
    const data = await getAllStars(page, take);
    res.status(200).json({
      message: 'success',
      data,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

export const saveStar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, age } = req.body;
    const image = res.locals.image;
    const user = res.locals.user;

    const data = await addStar(
      {
        name,
        description,
        image,
        age,
      },
      user
    );
    res.status(200).json({
      message: 'success',
      data,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

export const getStarsOfUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt((req.query.page as string) || '1');
    const take = parseInt((req.query.size as string) || '5');
    const data = await getStarsByUsername(req.params.username, page, take);

    res.status(200).json({
      message: 'success',
      data,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

export const getStarDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!(await areStarsPublic(req.params.starId))) next(new GlobalError('Page not found', 404));
    // if someone try to reach private Movie Star,it throws 404

    const starId = req.params.starId;
    const userId = res.locals.user.id;
    const star = await getStarById(starId);
    const likeCount = await getLikesCountByStarId(starId);
    const userLike = await isLikeExistOnStar(starId, userId);
    console.log(userLike);

    const data = {
      star,
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
export const updateStar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.user.id;
    if (res.locals.image !== null && res.locals.image !== undefined) {
      req.body.image = res.locals.image;
    }

    await updateStarById(req.body.id, req.body, userId);
    res.status(200).json({
      message: 'success',
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

export const deleteStar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteStarById(req.params.starId, res.locals.user.id);

    res.status(204).json({
      message: 'success',
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

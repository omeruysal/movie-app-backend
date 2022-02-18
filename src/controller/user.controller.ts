import { NextFunction, Request, Response } from 'express';
import { getAllUsers, getUserByUsername } from '../service/user.service';
import GlobalError from '../utils/appError';

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getUserByUsername(req.params.username);
    res.status(200).json({
      message: 'success',
      data,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

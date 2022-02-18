import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { getManager } from 'typeorm';
import { User } from '../entity/user.entity';
import { getUserById } from '../service/user.service';
import GlobalError from '../utils/appError';

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jwt = req.cookies['jwt'];

    const payload: any = verify(jwt, <string>process.env.SECRET_KEY);
    if (!payload) throw new GlobalError('Unauthenticated user', 401); // if we can not get payload from jwt

    res.locals.user = await getUserById(payload.id);

    next();
  } catch (error: any) {
    next(new GlobalError(error.message, 401));
  }
};

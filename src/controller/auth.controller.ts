import { NextFunction, Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import { getManager } from 'typeorm';
import { User } from '../entity/user.entity';
import bcryptjs from 'bcryptjs';
import {
  getUserByEmail,
  saveUser,
  updatePassword,
  updateUser,
  updatePublicMovieProperty,
  updatePublicStarProperty,
} from '../service/user.service';
import { nextTick } from 'process';
import GlobalError from '../utils/appError';
import { validationResult } from 'express-validator';

export const Register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors: any = {};
      errors.array().forEach((error) => (validationErrors[error.param] = error.msg));

      return res.status(400).send({ validationErrors: validationErrors });
    }

    const { username, firstName, lastName, email, image } = body;
    if (body.password !== body.passwordConfirm) {
      return res.status(400).send({ validationErrors: { passwordConfirm: 'Password does not match' } });
    }

    const { password, ...data } = await saveUser({
      username,
      firstName,
      lastName,
      email,
      image,
      password: await bcryptjs.hash(body.password, 10),
    });
    res.status(201).json({
      message: 'success',
      data,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};
export const Login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const user = await getUserByEmail(email);
    if (!user || !(await bcryptjs.compare(req.body.password, user.password))) {
      return res.status(404).send({ validationErrors: { credentials: 'Invalid credentials' } });
    }

    const payload = {
      id: user.id,
    };
    const token = sign(payload, <string>process.env.SECRET_KEY);
    // We send token in cookie because it is safer

    res.cookie('jwt', token, {
      httpOnly: true, // To avoid Xss attacks. No one can reach our cookie with using js
      maxAge: 24 * 60 * 60 * 1000,
    });
    const { password, ...data } = user;
    res.status(200).json({
      message: 'success',
      data,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

export const Logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    res.cookie('jwt', { maxAge: 0 });

    res.status(200).json({
      message: 'success',
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

export const UpdatePublicMovie = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.user.id;
    const { value } = req.body;
    const data = await updatePublicMovieProperty(userId, value);

    res.status(201).json({
      message: 'success',
      data,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

export const UpdatePublicStar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.user.id;
    const { value } = req.body;

    const data = await updatePublicStarProperty(userId, value);

    res.status(201).json({
      message: 'success',
      data,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};
export const UpdateMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.user.id;
    if (res.locals.image !== null && res.locals.image !== undefined) {
      req.body.image = res.locals.image;
    }
    const data = await updateUser(userId, req.body);

    res.status(201).json({
      message: 'success',
      data,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

export const UpdatePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.user.id;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const validationErrors: any = {};
      errors.array().forEach((error) => (validationErrors[error.param] = error.msg));
      return res.status(400).send({ validationErrors: validationErrors });
    }

    if (req.body.password !== req.body.passwordConfirm) {
      return res.status(400).send({ validationErrors: { passwordConfirm: 'Password does not match' } });
    }

    await updatePassword(userId, { password: await bcryptjs.hash(req.body.password, 10) });

    res.status(201).json({
      message: 'success',
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

export const LoginSocial = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, username } = req.body;

    let user;
    const tempUser = await getUserByEmail(email);
    if (!tempUser) {
      const data = await saveUser({
        username,
        email,
      });

      user = Object.assign({}, data);
    } else {
      user = Object.assign({}, tempUser);
    }
    const payload = {
      id: user.id,
    };
    const token = sign(payload, <string>process.env.SECRET_KEY);

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'success',
      data: user,
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

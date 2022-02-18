import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import GlobalError from '../utils/appError';

export const Upload = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let fileName: string;
    const storage = multer.diskStorage({
      destination: './uploads',
      filename(_, file, callback) {
        const randomName = Math.random().toString(20).substr(2, 12);
        fileName = `${randomName}-${file.originalname}`;
        return callback(null, fileName);
      },
    });

    const upload = multer({ storage }).single('image');

    upload(req, res, (error) => {
      if (error) {
        next(new GlobalError(error.message));
      }

      res.locals.image = fileName;
      next();
    });
  } catch (error: any) {
    next(new GlobalError(error.message));
  }
};

import cookieParser from 'cookie-parser';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './controller/error.controller';
import authRouter from './route/auth.route';
import commentRouter from './route/comment.route';
import likeRouter from './route/like.route';
import movieRouter from './route/movie.route';
import starRouter from './route/star.route';
import userRouter from './route/user.route';
import GlobalError from './utils/appError';

const app = express();

app.use(express.json());

app.use(cookieParser());
app.use(
  cors({
    credentials: true, //For exchange cookies, if we do not add this property then we can not reach cookies from front-end
    origin: ['http://localhost:3000'], // With cors middleware, we allow our front-end end to reach back-end
  })
);
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/movies', movieRouter);
app.use('/stars', starRouter);
app.use('/comments', commentRouter);
app.use('/likes', likeRouter);
app.use('/api/uploads', express.static('./uploads'));

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new GlobalError('Could not find the url : ' + req.originalUrl, 404));
});

app.use(globalErrorHandler);
export default app;

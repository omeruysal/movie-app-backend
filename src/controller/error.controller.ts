import { NextFunction, Request, Response } from 'express';

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  err.statusCode = err.statusCode || 500; // if statusCode is missing we add 500 internal server error
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    message: err.message,
  });
};
export default globalErrorHandler;

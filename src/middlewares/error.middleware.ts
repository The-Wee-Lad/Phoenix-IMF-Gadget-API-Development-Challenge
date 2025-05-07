import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ApiError, ApiResponse } from '../utils/index.js';

const globalErrorHandler = async (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Server Error : something went awry';
  const customErrorCode = error.customErrorCode || 'UNEXPECTED_ERROR';
  res
    .status(statusCode)
    .json(new ApiResponse(statusCode, message, {}, customErrorCode));
  console.error(error);
};

export { globalErrorHandler };

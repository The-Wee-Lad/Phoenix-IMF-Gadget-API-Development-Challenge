import jwt, { JwtPayload } from 'jsonwebtoken';
import { asyncHandler, ApiError, ApiResponse } from '../utils/index.js';
import { Request, Response, NextFunction } from 'express';
import { prismaClient } from '../db/index.js';
import { config } from '../configAndConstants.js';

const verifyToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken: string | undefined =
      req.cookies?.accessToken ||
      req.headers?.authorization?.split(' ')[1].trim();

    if (!accessToken) {
      throw new ApiError(401, ' No Access Token Found!', 'AUTH_001');
    }

    let decodedToken: string | JwtPayload | undefined;
    try {
      decodedToken = jwt.verify(accessToken, config.ACCESS_TOKEN_KEY);
    } catch (err: unknown) {
      if (err instanceof Error)
        if (err.name === 'TokenExpiredError')
          throw new ApiError(401, 'Access Token Expired', 'AUTH_003');
        else throw new ApiError(401, 'Invalid Token', 'AUTH_002');
    }

    const user = await prismaClient.user.findUnique({
      where: {
        id: (decodedToken as JwtPayload)?.id,
      },
      omit: {
        password: true,
      },
    });

    if (!user) {
      throw new ApiError(400, 'no such user found', 'AUTH_002');
    }

    req.user = user;
    next();
  }
);

export { verifyToken };

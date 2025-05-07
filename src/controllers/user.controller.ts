import {
  asyncHandler,
  ApiError,
  ApiResponse,
  generateTokens,
  hashPassword,
  comparePassword,
} from '../utils/index.js';

import { prismaClient } from '../db/index.js';
import { Request, Response, NextFunction } from 'express';
import {
  RequestRegister,
  RequestLogin,
  RequestDelete,
} from '../../types/index';
import { cookieOptions } from '../configAndConstants.js';

const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, username, email, password } = req.body as RequestRegister;
  if (!username || !email || !password)
    throw new ApiError(400, 'Missing Feilds', 'AUTH_011');

  const existingUser: boolean = (await prismaClient.user.findFirst({
    where: {
      OR: [
        {
          username: username,
        },
        {
          email: email,
        },
      ],
    },
  }))
    ? true
    : false;

  if (existingUser)
    throw new ApiError(409, 'Username or Email already exists', 'AUTH_012');

  const newUser = await prismaClient.user.create({
    data: {
      username: username,
      email: email,
      password: await hashPassword(password),
      name: name,
    },
    omit: {
      password: true,
    },
  });

  if (!newUser) throw new ApiError(500, "Couldn't Register", 'DB_003');

  res.status(200).json(new ApiResponse(200, 'User Created', newUser));
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const { usernameOrEmail, password } = req.body as RequestLogin;

  if (!usernameOrEmail || !password)
    throw new ApiError(400, 'Missing Feilds', 'AUTH_011');

  const user = await prismaClient.user.findFirst({
    where: {
      OR: [
        {
          username: usernameOrEmail,
        },
        {
          email: usernameOrEmail,
        },
      ],
    },
  });

  if (!user) throw new ApiError(401, 'No such user found', 'AUTH_006');

  if (!(await comparePassword(user.password, password)))
    throw new ApiError(401, 'Wrong Password', 'AUTH_006');

  const { accessToken, refreshToken } = await generateTokens(user);
  console.log('Refresh Token Length : ', refreshToken.length);
  const updatedUser = await prismaClient.user.updateManyAndReturn({
    where: {
      id: user.id,
    },
    data: {
      refreshToken: refreshToken,
    },
    omit: {
      password: true,
      refreshToken: true,
    },
  });

  if (!updatedUser) {
    throw new ApiError(500, 'DB Server error', 'DB_003');
  }

  res
    .status(200)
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json(
      new ApiResponse(200, 'User Logged in', {
        accessToken,
        refreshToken,
        user: updatedUser,
      })
    );
});

const logout = asyncHandler(async (req: Request, res: Response) => {
  await prismaClient.user.update({
    data: {
      refreshToken: null,
    },
    where: {
      id: req.user?.id,
    },
  });

  res
    .status(200)
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json(new ApiResponse(200, 'Logged user out', {}));
});

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { password } = req.body as RequestDelete;

  const user = await prismaClient.user.findUnique({
    where: { id: req.user?.id },
  });
  if (!user) throw new ApiError(401, 'Invalid Delete request', 'AUTH_021');

  if (!(await comparePassword(user.password, password)))
    throw new ApiError(401, 'Wronng Password', 'AUTH_020');

  const deleted = await prismaClient.user.delete({ where: { id: user.id } });
  if (!deleted) throw new ApiError(500, 'DB server error', 'DB_003');
  res
    .status(200)
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json(new ApiResponse(200, 'User Deleted', deleted));
});

const update = asyncHandler(async (req: Request, res: Response) => {
  const { name, username, email, newPassword, confirmPassword } = req.body;

  let user = await prismaClient.user.findUnique({
    where: { id: req.user?.id },
  });
  if (!user) throw new ApiError(500, 'User Fetch failed.', 'DB_003');

  let updateQuery: any = {};

  if (name) updateQuery.name = name;

  if (!(await comparePassword(user.password, confirmPassword)))
    throw new ApiError(401, 'Invalid Password', 'Auth_020');

  const existingUser: boolean = (await prismaClient.user.findFirst({
    where: {
      OR: [
        {
          username: username,
        },
        {
          email: email,
        },
      ],
    },
  }))
    ? true
    : false;
  if (username || email) {
    if (existingUser)
      throw new ApiError(409, 'Username or Email already exists', 'AUTH_012');
    if (username) updateQuery.username = username;
    if (email) updateQuery.email = email;
  }

  if (newPassword) {
    updateQuery.password = await hashPassword(newPassword);
  }

  let updatedUser = await prismaClient.user.update({
    where: {
      id: req.user?.id,
    },
    data: updateQuery,
    omit: {
      password: true,
      refreshToken: true,
    },
  });

  if (!updatedUser) throw new ApiError(500, 'DB server error', 'DB_003');

  res.status(200).json(new ApiResponse(200, 'User Updated', updatedUser));
});

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await prismaClient.user.findUnique({
    where: { id: req.user?.id },
    omit: {
      refreshToken: true,
      password: true,
    },
  });
  if (!user) throw new ApiError(500, 'User Fetch failed.', 'DB_003');
  res.status(200).json(new ApiResponse(200, 'Current User Fetched.', user));
});

export { register, login, logout, deleteUser, update, getCurrentUser };

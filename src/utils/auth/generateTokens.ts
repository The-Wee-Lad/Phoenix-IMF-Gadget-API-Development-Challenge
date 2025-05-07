import jwt from 'jsonwebtoken';
import { User } from '../../../generated/client/index.js';
import { config } from '../../configAndConstants.js';
import ms from 'ms';

const generateTokens = async (user: User) => {
  const accessToken = jwt.sign(
    {
      name: user.name,
      id: user.id,
      username: user.username,
      email: user.email,
    },
    config.ACCESS_TOKEN_KEY,
    {
      expiresIn: config.ACCESS_TOKEN_EXPIRES as ms.StringValue,
    }
  );
  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    config.REFRESH_TOKEN_EXPIRES,
    {
      expiresIn: config.REFRESH_TOKEN_EXPIRES as ms.StringValue,
    }
  );

  return { accessToken, refreshToken };
};

export { generateTokens };

import { User } from '../../generated/prisma/index';

declare module 'express' {
  export interface Request {
    user?: Omit<User, 'password'>;
  }
}

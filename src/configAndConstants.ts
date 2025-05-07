import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors';
dotenv.config({
  path: './.env',
});

console.log("Environment : ", process.env.NODE_ENV);

// Configuration Types
interface Config {
  DATABASE_URL: string;
  ACCESS_TOKEN_KEY: string;
  REFRESH_TOKEN_KEY: string;
  ACCESS_TOKEN_EXPIRES: string;
  REFRESH_TOKEN_EXPIRES: string;
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'staging';
  BASE_API_URL: string;
}

// Configuration

const config: Config = {
  DATABASE_URL: process.env.DATABASE_URL!,
  ACCESS_TOKEN_KEY: process.env.ACCESS_TOKEN_KEY!,
  REFRESH_TOKEN_KEY: process.env.REFRESH_TOKEN_KEY!,
  ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES!,
  REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES!,
  PORT: parseInt(process.env.PORT!, 10) || 3000,
  NODE_ENV:
    (process.env.NODE_ENV! as 'development' | 'production' | 'staging') ||
    'development',
  BASE_API_URL: process.env.BASE_API_URL!,
};


// Constants

const cookieOptions = {
  secure: config.NODE_ENV === 'production',
  httpOnly: true,
};
const whitelist: string[] = [
  `http://localhost:${config.PORT}`,
  `https://mehSomeFrontend.com`,
];

const isDev = config.NODE_ENV == 'development';

const corsOptions: CorsOptions = {
  origin: function (origin: string | undefined, callback) {
    if ((isDev && !origin) || whitelist.indexOf(origin || '') !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS ERROR :: ORIGIN NOT ALLOWED'));
    }
  },
  credentials: true,
};

const firstName: string[] = [
  'Rando',
  'The',
  'Barthelmew',
  'Raphael The',
  'Trader',
  'Night',
  'Silent',
  'Dark',
  'Clean',
  'Burning',
  'A',
];

const secondName: string[] = [
  'Nightwatch',
  'Death',
  'Stalker',
  'Joe',
  'Death',
  'Knight',
  'Crawler',
  'Slate',
  'Red',
  'Fart',
  'Clover',
  'Nightingale',
];

const maxRange: number = 100,
  minRange: number = 0;

export { cookieOptions, config, corsOptions, firstName, secondName };

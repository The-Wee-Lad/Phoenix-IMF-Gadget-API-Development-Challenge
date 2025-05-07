import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config, corsOptions, cookieOptions } from './configAndConstants.js';
import { globalErrorHandler } from './middlewares/error.middleware.js';

const app = express();

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ limit: '16KB', extended: true }));
app.use(express.json({ limit: '16Kb' }));

import { userRouter } from './routes/user.route.js';
import { gadgetRouter } from './routes/gadget.route.js';
import { ApiError, ApiResponse } from './utils/index.js';

app.get(config.BASE_API_URL + '/healthCheck', (req, res) => {
  res.status(200).json(new ApiResponse(200, 'Server Alive!', {}));
});
app.use(config.BASE_API_URL + '/user', userRouter);
app.use(config.BASE_API_URL + '/gadget', gadgetRouter);

app.use(globalErrorHandler);
export { app };

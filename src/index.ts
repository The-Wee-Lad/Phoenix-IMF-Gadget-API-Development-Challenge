import { connectToDb } from './db/index.js';
import { app } from './app.js';
import { config } from './configAndConstants.js';

connectToDb()
  .then((_) => {
    app.on('error', (err) => {
      console.error('Error starting server:', err);
    });
    app.listen(config.PORT, () => {
      console.log('Listening in ', config.NODE_ENV, ' at PORT : ', config.PORT);
    });
  })
  .catch((err) => {
    console.log('Error in App : ', err);
  });

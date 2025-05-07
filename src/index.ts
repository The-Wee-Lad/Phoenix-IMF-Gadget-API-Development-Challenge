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

      fetch('https://https://phoenix-imf-gadget-api-development-challenge-production.up.railway.app/healthCheck')
        .then(response => response.json())  // Convert the response to JSON (if applicable)
        .then(data => {
          console.log(data);  // Handle the data received from the response
        })
        .catch(error => {
          console.error('Error:', error);  // Handle any error
        });


    });
  })
  .catch((err) => {
    console.log('Error in App : ', err);
  });

import { createConnection, createConnections } from 'typeorm';
import app from './app';

(async () => {
  try {
    await createConnections();
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log('Server is running');
    });
  } catch (error) {
    console.log(error);
  }
})();

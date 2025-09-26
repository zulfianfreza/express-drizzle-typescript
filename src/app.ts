import express, { Application } from 'express';
import cors from 'cors';
import routes from './routes';
import {
  notFoundHandler,
  errorHandler,
} from './middleware/error-handler.middleware';

export function createApp(): Application {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api', routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

export default createApp;

import { createServer } from 'http';
import dotenv from 'dotenv';
import createApp from './app';
import logger from './config/logger';

dotenv.config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 8000;

async function bootstrap() {
  try {
    const app = createApp();
    const server = createServer(app);

    server.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
      logger.info(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error);
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();

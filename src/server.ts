import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import http from 'http';
import { v4 as uuid } from 'uuid';
import { env } from '@/config';
import { logger } from '@/utils';

const app = express();

app.use((req, _res, next) => {
  req.headers['x-request-id'] = req.headers['x-request-id'] || uuid();
  next();
});

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

const start = async (): Promise<void> => {
  try {
    const server = http.createServer(app);
    server.listen(env.PORT, () => {
      logger.info(`Server listening on port http://localhost:${env.PORT}`);
    });
  } catch (err) {
    logger.error({ error: err }, 'Startup error');
    process.exit(1);
  }
};

start();

export default app;

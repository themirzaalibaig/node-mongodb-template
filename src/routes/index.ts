import { Router } from 'express';
import { ResponseUtil } from '@/utils/response';
import { env } from '@/config/env.config';
import testsRouter from '@/routes/tests.routes';

const router = Router();

router.get('/health', (req, res) => {
  return ResponseUtil.success(
    res,
    {
      status: 'ok',
    },
    'Service healthy',
    undefined,
    {
      version: env.API_VERSION,
      timestamp: Date.now(),
    },
  );
});

router.use('/tests', testsRouter);

export default router;

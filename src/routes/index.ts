import { Router } from 'express';
import { Res } from '@/utils/response';
import { env } from '@/config/env.config';
import testsRouter from '@/routes/tests.routes';
import uploadsRouter from '@/routes/uploads.routes';

const router = Router();

router.get('/health', (req, res) => {
  return Res.success(
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
router.use('/uploads', uploadsRouter);

export default router;

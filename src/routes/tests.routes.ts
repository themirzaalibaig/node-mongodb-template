import { Router } from 'express';
import { validate } from '@/middlewares/validation.middleware';
import {
  createTestSchema,
  updateTestSchema,
  testIdParamsSchema,
  listTestsQuerySchema,
} from '@/validations';
import {
  createTestController,
  getTestController,
  updateTestController,
  deleteTestController,
  listTestsController,
} from '@/controllers';

const testsRouter = Router();

testsRouter.get('/', validate({ query: listTestsQuerySchema }), listTestsController);
testsRouter.post('/', validate({ body: createTestSchema }), createTestController);
testsRouter.get('/:id', validate({ params: testIdParamsSchema }), getTestController);
testsRouter.put(
  '/:id',
  validate({ params: testIdParamsSchema, body: updateTestSchema }),
  updateTestController,
);
testsRouter.delete('/:id', validate({ params: testIdParamsSchema }), deleteTestController);

export default testsRouter;

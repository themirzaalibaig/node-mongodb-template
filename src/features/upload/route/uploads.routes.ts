import { Router } from 'express';
import { validate } from '@/middlewares';
import { idempotency } from '@/middlewares';
import {
  uploadUpdateSchema,
  uploadIdParamsSchema,
  listUploadsQuerySchema,
  createUploadController,
  createUploadsController,
  getUploadController,
  listUploadsController,
  updateUploadController,
  deleteUploadController,
  uploadSingleMiddleware,
  uploadMultipleMiddleware,
} from '@/features/upload';

export const uploadsRouter = Router();

uploadsRouter.get('/', validate({ query: listUploadsQuerySchema }), listUploadsController);
uploadsRouter.post('/', idempotency('upload'), uploadSingleMiddleware, createUploadController);
uploadsRouter.post(
  '/multiple',
  idempotency('uploadMultiple'),
  uploadMultipleMiddleware,
  createUploadsController,
);
uploadsRouter.get('/:id', validate({ params: uploadIdParamsSchema }), getUploadController);
uploadsRouter.put(
  '/:id',
  validate({ params: uploadIdParamsSchema, body: uploadUpdateSchema }),
  updateUploadController,
);
uploadsRouter.delete('/:id', validate({ params: uploadIdParamsSchema }), deleteUploadController);

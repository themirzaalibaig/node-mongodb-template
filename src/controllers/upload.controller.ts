import { Response } from 'express';
import multer from 'multer';
import { Res } from '@/utils';
import {
  anyUploadSchema,
  imageUploadSchema,
  videoUploadSchema,
  uploadIdParamsSchema,
  uploadUpdateSchema,
  uploadCreateSchema,
  listUploadsQuerySchema,
} from '@/validations';
import {
  createUploadFromBuffer,
  getUploadById,
  listUploads,
  updateUploadById,
  deleteUploadById,
} from '@/services';
import { TypedRequest } from '@/types';

const storage = multer.memoryStorage();
export const uploadSingleMiddleware = multer({ storage }).single('file');
export const uploadMultipleMiddleware = multer({ storage }).array('files');

export const createUploadController = async (
  req: TypedRequest<unknown, unknown>,
  res: Response,
) => {
  const body = uploadCreateSchema.safeParse(req.body);
  if (!body.success)
    return Res.validationError(
      res,
      body.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })) as any,
    );
  const file = (req as any).file;
  const parsed = imageUploadSchema.safeParse(file);
  const parsedVideo = videoUploadSchema.safeParse(file);
  const parsedAny = anyUploadSchema(
    ['application/pdf', 'text/plain', 'application/json'],
    10 * 1024 * 1024,
  ).safeParse(file);
  if (!parsed.success && !parsedVideo.success && !parsedAny.success)
    return Res.validationError(res, [{ field: 'file', message: 'Invalid file' }] as any);
  const doc = await createUploadFromBuffer(file, {
    refType: body.data.refType,
    refId: body.data.refId,
  });
  return Res.created(res, { upload: doc });
};

export const createUploadsController = async (
  req: TypedRequest<unknown, unknown>,
  res: Response,
) => {
  const body = uploadCreateSchema.safeParse(req.body);
  if (!body.success)
    return Res.validationError(
      res,
      body.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })) as any,
    );
  const files = (req as any).files || [];
  const results = [] as any[];
  for (const f of files) {
    const ok =
      imageUploadSchema.safeParse(f).success ||
      videoUploadSchema.safeParse(f).success ||
      anyUploadSchema(
        ['application/pdf', 'text/plain', 'application/json'],
        10 * 1024 * 1024,
      ).safeParse(f).success;
    if (!ok) continue;
    const doc = await createUploadFromBuffer(f, {
      refType: body.data.refType,
      refId: body.data.refId,
    });
    results.push(doc);
  }
  return Res.created(res, { uploads: results });
};

export const getUploadController = async (req: TypedRequest<unknown, unknown>, res: Response) => {
  const params = uploadIdParamsSchema.safeParse((req as any).params);
  if (!params.success)
    return Res.validationError(
      res,
      params.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })) as any,
    );
  const doc = await getUploadById(params.data.id);
  if (!doc) return Res.notFound(res, 'Upload not found');
  return Res.success(res, { upload: doc });
};

export const listUploadsController = async (req: TypedRequest<unknown, unknown>, res: Response) => {
  const q = listUploadsQuerySchema.safeParse((req as any).query);
  if (!q.success)
    return Res.validationError(
      res,
      q.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })) as any,
    );
  const result = await listUploads(q.data);
  if (q.data.page && q.data.limit)
    return Res.paginated(res, { uploads: result.data }, result.total, q.data.page, q.data.limit);
  return Res.success(res, { uploads: result.data }, 'Data retrieved successfully', undefined, {
    total: result.total,
  });
};

export const updateUploadController = async (
  req: TypedRequest<unknown, unknown>,
  res: Response,
) => {
  const params = uploadIdParamsSchema.safeParse((req as any).params);
  if (!params.success)
    return Res.validationError(
      res,
      params.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })) as any,
    );
  const body = uploadUpdateSchema.safeParse(req.body);
  if (!body.success)
    return Res.validationError(
      res,
      body.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })) as any,
    );
  const doc = await updateUploadById(params.data.id, body.data as any);
  if (!doc) return Res.notFound(res, 'Upload not found');
  return Res.success(res, { upload: doc }, 'Updated');
};

export const deleteUploadController = async (
  req: TypedRequest<unknown, unknown>,
  res: Response,
) => {
  const params = uploadIdParamsSchema.safeParse((req as any).params);
  if (!params.success)
    return Res.validationError(
      res,
      params.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })) as any,
    );
  const ok = await deleteUploadById(params.data.id);
  if (!ok) return Res.notFound(res, 'Upload not found');
  return Res.noContent(res);
};

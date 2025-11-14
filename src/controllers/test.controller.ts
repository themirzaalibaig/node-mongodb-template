import { Request, Response } from 'express';
import { Res } from '@/utils';
import { GetAllTestDto, GetAllTestsDto } from '@/dto';
import { createTest, getTestById, updateTestById, deleteTestById, listTests } from '@/services';

export const createTestController = async (req: Request, res: Response) => {
  try {
    const doc = await createTest(req.body);
    return Res.created(res, doc);
  } catch (err: any) {
    if (err?.code === 11000) {
      return Res.conflict(res, 'Email already exists');
    }
    return Res.internalError(res);
  }
};

export const getTestController = async (req: Request, res: Response) => {
  const doc = await getTestById(req.params.id);
  if (!doc) return Res.notFound(res, 'Test not found');
  return Res.success(res, doc);
};

export const updateTestController = async (req: Request, res: Response) => {
  try {
    const doc = await updateTestById(req.params.id, req.body);
    if (!doc) return Res.notFound(res, 'Test not found');
    return Res.success(res, doc, 'Updated');
  } catch (err: any) {
    if (err?.code === 11000) {
      return Res.conflict(res, 'Email already exists');
    }
    return Res.internalError(res);
  }
};

export const deleteTestController = async (req: Request, res: Response) => {
  const doc = await deleteTestById(req.params.id);
  if (!doc) return Res.notFound(res, 'Test not found');
  return Res.noContent(res);
};

export const listTestsController = async (req: Request, res: Response) => {
  const dto = req.query as GetAllTestsDto;
  const result = await listTests(dto);
  if (dto.page && dto.limit) {
    return Res.paginated(res, result.data, result.totalItems, dto.page, dto.limit);
  }
  return Res.success(res, result.data, 'Data retrieved successfully', undefined, {
    total: result.totalItems,
  });
};

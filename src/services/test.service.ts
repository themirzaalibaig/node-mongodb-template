import { TestModel } from '@/models';
import { cacheGet, cacheSet, cacheDel, makeKey } from '@/utils';
import { CreateTestDto, UpdateTestDto, GetAllTestsDto } from '@/dto';

export const createTest = async (payload: CreateTestDto) => {
  const doc = await TestModel.create(payload);
  await cacheSet(makeKey('test', doc.id), doc, 300);
  return doc;
};

export const getTestById = async (id: string) => {
  const cacheKey = makeKey('test', id);
  const cached = await cacheGet<any>(cacheKey);
  if (cached) return cached;
  const doc = await TestModel.findById(id);
  if (doc) await cacheSet(cacheKey, doc, 300);
  return doc;
};

export const updateTestById = async (id: string, payload: UpdateTestDto) => {
  const doc = await TestModel.findByIdAndUpdate(id, payload, { new: true });
  if (doc) await cacheSet(makeKey('test', id), doc, 300);
  return doc;
};

export const deleteTestById = async (id: string) => {
  const doc = await TestModel.findByIdAndDelete(id);
  await cacheDel(makeKey('test', id));
  return doc;
};

export const listTests = async (dto: GetAllTestsDto) => {
  const sortField = dto.sort || (dto as any).sortBy || 'createdAt';
  const order = dto.order || 'desc';
  const sortSpec: Record<string, 1 | -1> = { [sortField]: order === 'asc' ? 1 : -1 };
  const totalItems = await TestModel.countDocuments();

  const page = dto.page;
  const limit = dto.limit;

  if (page && limit) {
    const skip = (page - 1) * limit;
    const cacheKey = makeKey('test', 'list', page, limit, sortField, order);
    const cached = await cacheGet<any>(cacheKey);
    if (cached) return cached;
    const data = await TestModel.find().sort(sortSpec).skip(skip).limit(limit);
    const result = { data, totalItems, currentPage: page, itemsPerPage: limit };
    await cacheSet(cacheKey, result, 60);
    return result;
  }

  const cacheKey = makeKey('test', 'list', 'all', sortField, order);
  const cached = await cacheGet<any>(cacheKey);
  if (cached) return cached;
  const data = await TestModel.find().sort(sortSpec);
  const result = { data, totalItems };
  await cacheSet(cacheKey, result, 60);
  return result;
};

import { z } from 'zod';
import { querySchema } from '@/validations/common.validations';

export const uploadUpdateSchema = z.object({
  status: z.enum(['TEMP', 'ACTIVE']).optional(),
  refType: z.string().optional(),
  refId: z.string().optional(),
  seo: z
    .object({
      metaTitle: z.string().optional(),
      metaDescription: z.string().optional(),
      metaKeywords: z.array(z.string()).optional(),
    })
    .optional(),
});

export const uploadCreateSchema = z.object({
  refType: z.string().optional(),
  refId: z.string().optional(),
});

export const uploadIdParamsSchema = z.object({ id: z.string() });

export const listUploadsQuerySchema = querySchema.extend({
  refType: z.string().optional(),
  refId: z.string().optional(),
  status: z.enum(['TEMP', 'ACTIVE']).optional(),
  type: z.enum(['image', 'video', 'raw', 'auto']).optional(),
});

import { z } from 'zod';
import { UploadStatus } from '@/types';
import { listUploadsQuerySchema } from '@/features/upload/validations/upload.model.validations';

export interface CreateUploadDto {
  refType?: string;
  refId?: string;
}

export interface UpdateUploadDto {
  status?: UploadStatus;
  refType?: string;
  refId?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
}

export interface GetAllUploadsDto extends z.infer<typeof listUploadsQuerySchema> {}

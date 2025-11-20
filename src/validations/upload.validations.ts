import { z } from 'zod';

const allowedImages = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const allowedVideos = ['video/mp4', 'video/webm', 'video/ogg'];

export const anyUploadSchema = (mimes: string[], maxBytes: number) =>
  z
    .object({
      fieldname: z.string(),
      originalname: z.string(),
      encoding: z.string(),
      mimetype: z.string(),
      size: z.number().max(maxBytes),
      buffer: z.instanceof(Buffer),
    })
    .refine((f) => mimes.includes(f.mimetype), {
      message: 'Unsupported file type',
      path: ['mimetype'],
    });

export const imageUploadSchema = anyUploadSchema(allowedImages, 10 * 1024 * 1024);
export const videoUploadSchema = anyUploadSchema(allowedVideos, 100 * 1024 * 1024);

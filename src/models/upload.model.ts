import mongoose, { Document, Schema } from 'mongoose';
import { UploadStatus } from '@/types';

export interface UploadDocument extends Document {
  originalFilename: string;
  provider: 'local' | 'cloudinary' | 'aws';
  publicId: string;
  url: string;
  secureUrl: string;
  resourceType?: string;
  bytes?: number;
  width?: number;
  height?: number;
  format?: string;
  status: UploadStatus;
  refType?: string;
  refId?: string;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
}

const UploadSchema = new Schema<UploadDocument>(
  {
    originalFilename: { type: String, required: true },
    provider: { type: String, required: true, enum: ['local', 'cloudinary', 'aws'] },
    publicId: { type: String, required: true },
    url: { type: String, required: true },
    secureUrl: { type: String, required: true },
    resourceType: { type: String },
    bytes: { type: Number },
    width: { type: Number },
    height: { type: Number },
    format: { type: String },
    status: { type: String, required: true, enum: ['TEMP', 'ACTIVE'], default: 'TEMP' },
    refType: { type: String },
    refId: { type: String },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      metaKeywords: { type: [String] },
    },
  },
  { timestamps: true },
);

UploadSchema.index({ refType: 1, refId: 1 });

export const UploadModel = mongoose.model<UploadDocument>('Upload', UploadSchema);

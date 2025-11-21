export type UploadStatus = 'TEMP' | 'ACTIVE';

export interface UploadSeoMeta {
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
}

export interface UploadRef {
  refType?: string;
  refId?: string;
}

export interface Upload extends UploadRef {
  _id: string;
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
  seo?: UploadSeoMeta;
  createdAt: Date;
  updatedAt: Date;
}

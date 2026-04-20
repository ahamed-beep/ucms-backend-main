export interface IVideoTestimonial {
  id: string;
  name: string;
  university: string;
  videoUrl: string;
  videoPublicId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateVideoTestimonial {
  name: string;
  university: string;
}

export interface IUpdateVideoTestimonial {
  name?: string;
  university?: string;
}

export interface IVideoUpload {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}